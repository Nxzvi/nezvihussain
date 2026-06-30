import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE_PATH = path.join(__dirname, 'data.json');

let isMockMode = false;

// --- MONGOOSE SCHEMAS & MODELS ---
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  fullName: String,
  email: String,
  phone: String,
  location: String,
  github: String,
  linkedin: String,
  aboutText: String,
  roleText: String,
  experience: Array,
  certifications: Array,
  education: Array
});

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  icon: String,
  level: String
});

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  technologies: [String],
  githubUrl: String,
  liveUrl: String,
  category: String,
  image: String
});

const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: String,
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);
const Skill = mongoose.models.Skill || mongoose.model('Skill', skillSchema);
const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);
const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

// --- JSON FALLBACK STORAGE HELPERS ---
async function readJsonDb() {
  try {
    const data = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data.json, returning empty structure:', error);
    return { admin: {}, skills: [], projects: [], messages: [] };
  }
}

async function writeJsonDb(data) {
  try {
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to data.json:', error);
  }
}

// --- MAIN DATABASE OPERATIONS ---
export async function connectDatabase() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.log('⚠️ No MONGODB_URI found. Falling back to local JSON database.');
    isMockMode = true;
    return;
  }

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB successfully.');
    
    // Seed admin profile from data.json if MongoDB admin collection is empty
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      console.log('🌱 Seeding MongoDB from data.json...');
      const seedData = await readJsonDb();
      if (seedData.admin && seedData.admin.username) {
        await Admin.create(seedData.admin);
      }
      if (seedData.skills && seedData.skills.length > 0) {
        await Skill.insertMany(seedData.skills);
      }
      if (seedData.projects && seedData.projects.length > 0) {
        await Project.insertMany(seedData.projects);
      }
      console.log('🌱 Database seeding completed.');
    }
  } catch (error) {
    console.error('❌ MongoDB connection failed. Falling back to local JSON database.', error.message);
    isMockMode = true;
  }
}

export const db = {
  isMock: () => isMockMode,

  // --- ADMIN / PROFILE ---
  getAdmin: async () => {
    if (isMockMode) {
      const data = await readJsonDb();
      return data.admin || {};
    }
    return await Admin.findOne();
  },

  updateAdmin: async (adminData) => {
    if (isMockMode) {
      const data = await readJsonDb();
      data.admin = { ...data.admin, ...adminData };
      await writeJsonDb(data);
      return data.admin;
    }
    return await Admin.findOneAndUpdate({}, adminData, { new: true, upsert: true });
  },

  // --- SKILLS ---
  getSkills: async () => {
    if (isMockMode) {
      const data = await readJsonDb();
      return data.skills || [];
    }
    return await Skill.find();
  },

  createSkill: async (skillData) => {
    if (isMockMode) {
      const data = await readJsonDb();
      const newSkill = { id: Date.now().toString(), ...skillData };
      data.skills = data.skills || [];
      data.skills.push(newSkill);
      await writeJsonDb(data);
      return newSkill;
    }
    const skill = new Skill(skillData);
    return await skill.save();
  },

  updateSkill: async (id, skillData) => {
    if (isMockMode) {
      const data = await readJsonDb();
      const index = data.skills.findIndex(s => (s.id || s._id) === id);
      if (index === -1) return null;
      data.skills[index] = { ...data.skills[index], ...skillData };
      await writeJsonDb(data);
      return data.skills[index];
    }
    return await Skill.findByIdAndUpdate(id, skillData, { new: true });
  },

  deleteSkill: async (id) => {
    if (isMockMode) {
      const data = await readJsonDb();
      const lengthBefore = data.skills.length;
      data.skills = data.skills.filter(s => (s.id || s._id) !== id);
      await writeJsonDb(data);
      return data.skills.length < lengthBefore;
    }
    const result = await Skill.findByIdAndDelete(id);
    return result !== null;
  },

  // --- PROJECTS ---
  getProjects: async () => {
    if (isMockMode) {
      const data = await readJsonDb();
      return data.projects || [];
    }
    return await Project.find();
  },

  createProject: async (projectData) => {
    if (isMockMode) {
      const data = await readJsonDb();
      const newProject = { id: Date.now().toString(), ...projectData };
      data.projects = data.projects || [];
      data.projects.push(newProject);
      await writeJsonDb(data);
      return newProject;
    }
    const project = new Project(projectData);
    return await project.save();
  },

  updateProject: async (id, projectData) => {
    if (isMockMode) {
      const data = await readJsonDb();
      const index = data.projects.findIndex(p => (p.id || p._id) === id);
      if (index === -1) return null;
      data.projects[index] = { ...data.projects[index], ...projectData };
      await writeJsonDb(data);
      return data.projects[index];
    }
    return await Project.findByIdAndUpdate(id, projectData, { new: true });
  },

  deleteProject: async (id) => {
    if (isMockMode) {
      const data = await readJsonDb();
      const lengthBefore = data.projects.length;
      data.projects = data.projects.filter(p => (p.id || p._id) !== id);
      await writeJsonDb(data);
      return data.projects.length < lengthBefore;
    }
    const result = await Project.findByIdAndDelete(id);
    return result !== null;
  },

  // --- MESSAGES ---
  getMessages: async () => {
    if (isMockMode) {
      const data = await readJsonDb();
      return data.messages || [];
    }
    return await Message.find().sort({ createdAt: -1 });
  },

  createMessage: async (messageData) => {
    if (isMockMode) {
      const data = await readJsonDb();
      const newMessage = { 
        id: Date.now().toString(), 
        ...messageData, 
        read: false, 
        createdAt: new Date().toISOString() 
      };
      data.messages = data.messages || [];
      data.messages.push(newMessage);
      await writeJsonDb(data);
      return newMessage;
    }
    const message = new Message(messageData);
    return await message.save();
  },

  markMessageRead: async (id) => {
    if (isMockMode) {
      const data = await readJsonDb();
      const index = data.messages.findIndex(m => (m.id || m._id) === id);
      if (index === -1) return null;
      data.messages[index].read = true;
      await writeJsonDb(data);
      return data.messages[index];
    }
    return await Message.findByIdAndUpdate(id, { read: true }, { new: true });
  },

  deleteMessage: async (id) => {
    if (isMockMode) {
      const data = await readJsonDb();
      const lengthBefore = data.messages.length;
      data.messages = data.messages.filter(m => (m.id || m._id) !== id);
      await writeJsonDb(data);
      return data.messages.length < lengthBefore;
    }
    const result = await Message.findByIdAndDelete(id);
    return result !== null;
  }
};
