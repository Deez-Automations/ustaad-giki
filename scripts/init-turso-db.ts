// Script to initialize Turso database with all tables
// Run with: npx tsx scripts/init-turso-db.ts

import { config } from "dotenv";
config(); // Load .env file

import { createClient } from "@libsql/client";

const client = createClient({
    url: process.env.DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

async function initDatabase() {
    console.log("🚀 Initializing Turso database...");
    console.log("Database URL:", process.env.DATABASE_URL);

    try {
        // ========================================
        // CORE: USER & PROFILE
        // ========================================

        await client.execute(`
            CREATE TABLE IF NOT EXISTS User (
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

        await client.execute(`
            CREATE TABLE IF NOT EXISTS Profile (
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

        // ========================================
        // TIMETABLE
        // ========================================

        await client.execute(`
            CREATE TABLE IF NOT EXISTS TimeSlot (
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

        // ========================================
        // SOS ALERTS
        // ========================================

        await client.execute(`
            CREATE TABLE IF NOT EXISTS SOSAlert (
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

        // ========================================
        // BOOKING & SESSIONS
        // ========================================

        await client.execute(`
            CREATE TABLE IF NOT EXISTS Booking (
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

        // ========================================
        // MENTOR AVAILABILITY
        // ========================================

        await client.execute(`
            CREATE TABLE IF NOT EXISTS MentorAvailability (
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

        // ========================================
        // REVIEWS
        // ========================================

        await client.execute(`
            CREATE TABLE IF NOT EXISTS Review (
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

        // ========================================
        // USER PREFERENCES
        // ========================================

        await client.execute(`
            CREATE TABLE IF NOT EXISTS Preference (
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

        // ========================================
        // NOTIFICATIONS
        // ========================================

        await client.execute(`
            CREATE TABLE IF NOT EXISTS Notification (
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

        // ========================================
        // ACTIVITY LOG
        // ========================================

        await client.execute(`
            CREATE TABLE IF NOT EXISTS ActivityLog (
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

        // ========================================
        // INDEXES
        // ========================================

        console.log("\n📇 Creating indexes...");

        // User indexes
        await client.execute(`CREATE INDEX IF NOT EXISTS idx_user_email ON User(email)`);
        await client.execute(`CREATE INDEX IF NOT EXISTS idx_user_role ON User(role)`);

        // Profile indexes
        await client.execute(`CREATE INDEX IF NOT EXISTS idx_profile_isMentor ON Profile(isMentor)`);
        await client.execute(`CREATE INDEX IF NOT EXISTS idx_profile_rating ON Profile(rating)`);

        // TimeSlot indexes
        await client.execute(`CREATE INDEX IF NOT EXISTS idx_timeslot_userId ON TimeSlot(userId)`);
        await client.execute(`CREATE INDEX IF NOT EXISTS idx_timeslot_day ON TimeSlot(day)`);

        // Booking indexes
        await client.execute(`CREATE INDEX IF NOT EXISTS idx_booking_studentId ON Booking(studentId)`);
        await client.execute(`CREATE INDEX IF NOT EXISTS idx_booking_mentorId ON Booking(mentorId)`);
        await client.execute(`CREATE INDEX IF NOT EXISTS idx_booking_status ON Booking(status)`);
        await client.execute(`CREATE INDEX IF NOT EXISTS idx_booking_scheduledDate ON Booking(scheduledDate)`);
        await client.execute(`CREATE INDEX IF NOT EXISTS idx_booking_course ON Booking(course)`);

        // MentorAvailability indexes
        await client.execute(`CREATE INDEX IF NOT EXISTS idx_mentoravail_userId ON MentorAvailability(userId)`);
        await client.execute(`CREATE INDEX IF NOT EXISTS idx_mentoravail_day ON MentorAvailability(day)`);
        await client.execute(`CREATE INDEX IF NOT EXISTS idx_mentoravail_isActive ON MentorAvailability(isActive)`);

        // Review indexes
        await client.execute(`CREATE INDEX IF NOT EXISTS idx_review_mentorId ON Review(mentorId)`);
        await client.execute(`CREATE INDEX IF NOT EXISTS idx_review_studentId ON Review(studentId)`);
        await client.execute(`CREATE INDEX IF NOT EXISTS idx_review_rating ON Review(rating)`);

        // SOSAlert indexes
        await client.execute(`CREATE INDEX IF NOT EXISTS idx_sosalert_studentId ON SOSAlert(studentId)`);
        await client.execute(`CREATE INDEX IF NOT EXISTS idx_sosalert_acceptedById ON SOSAlert(acceptedById)`);
        await client.execute(`CREATE INDEX IF NOT EXISTS idx_sosalert_status ON SOSAlert(status)`);
        await client.execute(`CREATE INDEX IF NOT EXISTS idx_sosalert_course ON SOSAlert(course)`);

        // Notification indexes
        await client.execute(`CREATE INDEX IF NOT EXISTS idx_notification_userId ON Notification(userId)`);
        await client.execute(`CREATE INDEX IF NOT EXISTS idx_notification_isRead ON Notification(isRead)`);
        await client.execute(`CREATE INDEX IF NOT EXISTS idx_notification_type ON Notification(type)`);

        // ActivityLog indexes
        await client.execute(`CREATE INDEX IF NOT EXISTS idx_activitylog_userId ON ActivityLog(userId)`);
        await client.execute(`CREATE INDEX IF NOT EXISTS idx_activitylog_action ON ActivityLog(action)`);
        await client.execute(`CREATE INDEX IF NOT EXISTS idx_activitylog_createdAt ON ActivityLog(createdAt)`);

        console.log("✅ All indexes created");

        console.log("\n🎉 Turso database initialized successfully!");
        console.log("📊 Tables created: User, Profile, TimeSlot, SOSAlert, Booking, MentorAvailability, Review, Preference, Notification, ActivityLog");
        console.log("🔗 Database URL:", process.env.DATABASE_URL);

    } catch (error) {
        console.error("❌ Error initializing database:", error);
        process.exit(1);
    }
}

initDatabase();
