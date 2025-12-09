// Script to sync Turso database with Prisma schema
// Run with: npx tsx scripts/sync-turso-schema.ts

import { config } from "dotenv";
config();

import { createClient } from "@libsql/client";

const client = createClient({
    url: process.env.DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

async function syncSchema() {
    console.log("🔄 Syncing Turso database schema...\n");

    try {
        // Drop all tables and recreate them fresh
        console.log("⚠️  Dropping existing tables (if any)...");

        const tables = [
            "ActivityLog",
            "Notification",
            "Preference",
            "Review",
            "MentorAvailability",
            "Booking",
            "SOSAlert",
            "TimeSlot",
            "Profile",
            "User"
        ];

        for (const table of tables) {
            try {
                await client.execute(`DROP TABLE IF EXISTS ${table}`);
                console.log(`   Dropped ${table}`);
            } catch (e) {
                // Ignore errors
            }
        }

        console.log("\n✅ Creating fresh tables...\n");

        // USER TABLE
        await client.execute(`
            CREATE TABLE User (
                id TEXT PRIMARY KEY,
                name TEXT,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT DEFAULT 'STUDENT' CHECK(role IN ('STUDENT', 'MENTOR', 'ADMIN')),
                isOnline INTEGER DEFAULT 0,
                lastSeenAt TEXT,
                createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
                updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("✅ User table created");

        // PROFILE TABLE
        await client.execute(`
            CREATE TABLE Profile (
                id TEXT PRIMARY KEY,
                userId TEXT UNIQUE NOT NULL,
                rollNumber TEXT UNIQUE NOT NULL,
                batch TEXT NOT NULL,
                faculty TEXT NOT NULL,
                department TEXT,
                cnic TEXT UNIQUE NOT NULL,
                phoneNumber TEXT,
                isVerified INTEGER DEFAULT 0,
                livePhotoUrl TEXT,
                isMentor INTEGER DEFAULT 0,
                mentorBio TEXT,
                hourlyRate INTEGER,
                subjects TEXT,
                proficiencyLevel TEXT,
                acceptsSOS INTEGER DEFAULT 1,
                totalEarnings REAL DEFAULT 0,
                rating REAL DEFAULT 0,
                reviewCount INTEGER DEFAULT 0,
                totalSessions INTEGER DEFAULT 0,
                isProfileComplete INTEGER DEFAULT 0,
                bio TEXT,
                createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
                updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
            )
        `);
        console.log("✅ Profile table created");

        // TIMESLOT TABLE
        await client.execute(`
            CREATE TABLE TimeSlot (
                id TEXT PRIMARY KEY,
                userId TEXT NOT NULL,
                day TEXT NOT NULL,
                startTime TEXT NOT NULL,
                endTime TEXT NOT NULL,
                title TEXT NOT NULL,
                location TEXT,
                color TEXT DEFAULT '#3b82f6',
                isClass INTEGER DEFAULT 1,
                createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
                updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
            )
        `);
        console.log("✅ TimeSlot table created");

        // SOSALERT TABLE
        await client.execute(`
            CREATE TABLE SOSAlert (
                id TEXT PRIMARY KEY,
                studentId TEXT NOT NULL,
                course TEXT NOT NULL,
                urgency TEXT NOT NULL CHECK(urgency IN ('Critical', 'High', 'Medium')),
                timeLeft INTEGER NOT NULL,
                description TEXT NOT NULL,
                status TEXT DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'ACCEPTED', 'COMPLETED', 'CANCELLED')),
                acceptedById TEXT,
                doubleRate INTEGER DEFAULT 1,
                expiresAt TEXT,
                createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (studentId) REFERENCES User(id) ON DELETE CASCADE,
                FOREIGN KEY (acceptedById) REFERENCES User(id)
            )
        `);
        console.log("✅ SOSAlert table created");

        // BOOKING TABLE
        await client.execute(`
            CREATE TABLE Booking (
                id TEXT PRIMARY KEY,
                studentId TEXT NOT NULL,
                mentorId TEXT NOT NULL,
                course TEXT NOT NULL,
                topic TEXT,
                scheduledDate TEXT NOT NULL,
                startTime TEXT NOT NULL,
                endTime TEXT NOT NULL,
                duration INTEGER NOT NULL,
                location TEXT,
                isOnline INTEGER DEFAULT 0,
                meetingLink TEXT,
                status TEXT DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW')),
                cancelledById TEXT,
                cancelReason TEXT,
                studentNotes TEXT,
                mentorNotes TEXT,
                sessionSummary TEXT,
                totalAmount REAL NOT NULL,
                isPaid INTEGER DEFAULT 0,
                isSOS INTEGER DEFAULT 0,
                sosAlertId TEXT UNIQUE,
                createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
                updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (studentId) REFERENCES User(id),
                FOREIGN KEY (mentorId) REFERENCES User(id),
                FOREIGN KEY (sosAlertId) REFERENCES SOSAlert(id)
            )
        `);
        console.log("✅ Booking table created");

        // MENTORAVAILABILITY TABLE
        await client.execute(`
            CREATE TABLE MentorAvailability (
                id TEXT PRIMARY KEY,
                userId TEXT NOT NULL,
                day TEXT NOT NULL,
                startTime TEXT NOT NULL,
                endTime TEXT NOT NULL,
                isRecurring INTEGER DEFAULT 1,
                isActive INTEGER DEFAULT 1,
                createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
                updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
            )
        `);
        console.log("✅ MentorAvailability table created");

        // REVIEW TABLE
        await client.execute(`
            CREATE TABLE Review (
                id TEXT PRIMARY KEY,
                mentorId TEXT NOT NULL,
                studentId TEXT NOT NULL,
                bookingId TEXT UNIQUE,
                rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
                comment TEXT,
                knowledgeRating INTEGER CHECK(knowledgeRating >= 1 AND knowledgeRating <= 5),
                communicationRating INTEGER CHECK(communicationRating >= 1 AND communicationRating <= 5),
                punctualityRating INTEGER CHECK(punctualityRating >= 1 AND punctualityRating <= 5),
                sessionDate TEXT NOT NULL,
                createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (mentorId) REFERENCES User(id) ON DELETE CASCADE,
                FOREIGN KEY (studentId) REFERENCES User(id),
                FOREIGN KEY (bookingId) REFERENCES Booking(id)
            )
        `);
        console.log("✅ Review table created");

        // PREFERENCE TABLE
        await client.execute(`
            CREATE TABLE Preference (
                id TEXT PRIMARY KEY,
                userId TEXT UNIQUE NOT NULL,
                emailNotifications INTEGER DEFAULT 1,
                pushNotifications INTEGER DEFAULT 1,
                smsNotifications INTEGER DEFAULT 0,
                preferredLanguage TEXT DEFAULT 'en',
                theme TEXT DEFAULT 'system',
                hideTimetableFromOthers INTEGER DEFAULT 0,
                showOnlineStatus INTEGER DEFAULT 1,
                allowSOSRequests INTEGER DEFAULT 1,
                preferredSessionDuration INTEGER,
                preferredCommunication TEXT,
                createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
                updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
            )
        `);
        console.log("✅ Preference table created");

        // NOTIFICATION TABLE
        await client.execute(`
            CREATE TABLE Notification (
                id TEXT PRIMARY KEY,
                userId TEXT NOT NULL,
                type TEXT NOT NULL CHECK(type IN ('BOOKING_REQUEST', 'BOOKING_CONFIRMED', 'BOOKING_CANCELLED', 'SOS_ALERT', 'REVIEW_RECEIVED', 'SYSTEM')),
                title TEXT NOT NULL,
                message TEXT NOT NULL,
                isRead INTEGER DEFAULT 0,
                actionUrl TEXT,
                metadata TEXT,
                createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
            )
        `);
        console.log("✅ Notification table created");

        // ACTIVITYLOG TABLE
        await client.execute(`
            CREATE TABLE ActivityLog (
                id TEXT PRIMARY KEY,
                userId TEXT NOT NULL,
                action TEXT NOT NULL,
                entityType TEXT,
                entityId TEXT,
                description TEXT,
                metadata TEXT,
                ipAddress TEXT,
                userAgent TEXT,
                createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
            )
        `);
        console.log("✅ ActivityLog table created");

        // INDEXES
        console.log("\n📇 Creating indexes...");

        await client.execute(`CREATE INDEX idx_user_email ON User(email)`);
        await client.execute(`CREATE INDEX idx_user_role ON User(role)`);
        await client.execute(`CREATE INDEX idx_profile_isMentor ON Profile(isMentor)`);
        await client.execute(`CREATE INDEX idx_profile_rating ON Profile(rating)`);
        await client.execute(`CREATE INDEX idx_timeslot_userId ON TimeSlot(userId)`);
        await client.execute(`CREATE INDEX idx_booking_studentId ON Booking(studentId)`);
        await client.execute(`CREATE INDEX idx_booking_mentorId ON Booking(mentorId)`);
        await client.execute(`CREATE INDEX idx_sosalert_studentId ON SOSAlert(studentId)`);
        await client.execute(`CREATE INDEX idx_sosalert_status ON SOSAlert(status)`);
        await client.execute(`CREATE INDEX idx_notification_userId ON Notification(userId)`);

        console.log("✅ All indexes created");

        console.log("\n🎉 Database schema synced successfully!");
        console.log("⚠️  Note: All existing data has been cleared.");

    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
}

syncSchema();
