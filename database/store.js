const session = require('express-session');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class PrismaSessionStore extends session.Store {
  constructor() {
    super();
  }

  // Fetch session by session ID
  async get(sid, callback) {
    try {
      const session = await prisma.session.findUnique({
        where: { sid },
      });

      if (session) {
        // Check if the session is expired
        if (session.expiresAt && session.expiresAt < new Date()) {
          await prisma.session.delete({ where: { sid } });
          return callback(null, null);
        }
        return callback(null, JSON.parse(session.data));
      }
      callback(null, null);
    } catch (err) {
      callback(err);
    }
  }

  // Create or update a session
  async set(sid, sessionData, callback) {
    try {
      const expiresAt = sessionData.cookie?.expires
        ? new Date(sessionData.cookie.expires)
        : new Date(Date.now() + 86400000); // Default to 1 day if no cookie expires field

      await prisma.session.upsert({
        where: { sid },
        update: {
          data: JSON.stringify(sessionData),
          expiresAt,
        },
        create: {
          id: sid, // Assuming `sid` is used as the primary key for `id`
          sid,
          data: JSON.stringify(sessionData),
          expiresAt,
        },
      });

      callback(null);
    } catch (err) {
      callback(err);
    }
  }

  // Destroy a session by session ID
  async destroy(sid, callback) {
    try {
      await prisma.session.delete({ where: { sid } });
      callback(null);
    } catch (err) {
      callback(err);
    }
  }

  // Clear all sessions
  async clear(callback) {
    try {
      await prisma.session.deleteMany();
      callback(null);
    } catch (err) {
      callback(err);
    }
  }

  // Get the count of active sessions
  async length(callback) {
    try {
      const count = await prisma.session.count();
      callback(null, count);
    } catch (err) {
      callback(err);
    }
  }
}

module.exports = PrismaSessionStore;
