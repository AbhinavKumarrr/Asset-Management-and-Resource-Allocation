import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function daysFromNow(days: number): Date {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d;
}

async function main() {
  console.log("Seeding AssetFlow database...");

  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.maintenanceRecord.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.asset.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const adminPass = await bcrypt.hash("admin123", 10);
  const userPass = await bcrypt.hash("user123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Abhinav Kumar",
      email: "abhinav@iitr.ac.in",
      passwordHash: adminPass,
      role: "ADMIN",
    },
  });

  const aditya = await prisma.user.create({
    data: {
      name: "Aditya Kumar Gaurav",
      email: "aditya@iitr.ac.in",
      passwordHash: userPass,
      role: "USER",
    },
  });

  const kalpesh = await prisma.user.create({
    data: {
      name: "Kalpesh Nandu Jagtap",
      email: "kalpesh@iitr.ac.in",
      passwordHash: userPass,
      role: "USER",
    },
  });

  const krish = await prisma.user.create({
    data: {
      name: "Krish Goyal",
      email: "krish@iitr.ac.in",
      passwordHash: userPass,
      role: "USER",
    },
  });

  const categoryData = [
    { name: "DSLR Cameras", description: "Professional cameras and lenses for photography." },
    { name: "Studio Lighting", description: "Softboxes, LED panels and lighting stands." },
    { name: "Audio Systems", description: "Speakers, mixers and PA systems." },
    { name: "Costumes", description: "Performance and theatre costumes." },
    { name: "Stage Props", description: "Props and set pieces for stage events." },
    { name: "Recording Equipment", description: "Microphones, recorders and accessories." },
    { name: "Event Infrastructure", description: "Tents, tables, barricades and staging." },
  ];

  const categories: Record<string, string> = {};
  for (const c of categoryData) {
    const created = await prisma.category.create({ data: c });
    categories[c.name] = created.id;
  }

  const assetData = [
    {
      name: "Canon EOS 90D DSLR",
      cat: "DSLR Cameras",
      qty: 6,
      condition: "EXCELLENT",
      location: "Media Room A",
      desc: "32.5MP APS-C DSLR, great for events and portraits.",
      imageUrl: "/assets/canon-eos-90d.jpg",
    },
    {
      name: "Nikon D7500 DSLR",
      cat: "DSLR Cameras",
      qty: 4,
      condition: "GOOD",
      location: "Media Room A",
      desc: "20.9MP DSLR with 4K video.",
      imageUrl: "/assets/nikon-d7500.jpg",
    },
    {
      name: "Canon 50mm f/1.8 Lens",
      cat: "DSLR Cameras",
      qty: 5,
      condition: "GOOD",
      location: "Media Room A",
      desc: "Prime lens for low-light and portraits.",
      imageUrl: "/assets/canon-50mm-lens.jpg",
    },
    {
      name: "Godox SL-60W LED Light",
      cat: "Studio Lighting",
      qty: 8,
      condition: "GOOD",
      location: "Studio 1",
      desc: "60W continuous LED studio light.",
      imageUrl: "/assets/godox-sl60w.jpg",
    },
    {
      name: "Softbox 80cm",
      cat: "Studio Lighting",
      qty: 10,
      condition: "GOOD",
      location: "Studio 1",
      desc: "Light diffuser softbox with stand.",
      imageUrl: "/assets/softbox.jpg",
    },
    {
      name: "JBL EON615 Speaker",
      cat: "Audio Systems",
      qty: 6,
      condition: "EXCELLENT",
      location: "Audio Store",
      desc: "1000W powered PA speaker.",
      imageUrl: "/assets/jbl-speaker.jpg",
    },
    {
      name: "Yamaha MG12XU Mixer",
      cat: "Audio Systems",
      qty: 3,
      condition: "GOOD",
      location: "Audio Store",
      desc: "12-channel analog mixing console.",
      imageUrl: "/assets/audio-mixer.jpg",
    },
    {
      name: "Theatre Costume Set (Royal)",
      cat: "Costumes",
      qty: 12,
      condition: "FAIR",
      location: "Wardrobe",
      desc: "Royal-era costumes for drama productions.",
      imageUrl: "/assets/royal-costume-set.jpg",
    },
    {
      name: "Folk Dance Costume Set",
      cat: "Costumes",
      qty: 20,
      condition: "GOOD",
      location: "Wardrobe",
      desc: "Traditional folk dance attire.",
      imageUrl: "/assets/costume-set.jpg",
    },
    {
      name: "Wooden Throne Prop",
      cat: "Stage Props",
      qty: 2,
      condition: "GOOD",
      location: "Prop Room",
      desc: "Decorative throne for stage productions.",
      imageUrl: "/assets/wooden-throne.jpg",
    },
    {
      name: "Stage Pillars (pair)",
      cat: "Stage Props",
      qty: 4,
      condition: "FAIR",
      location: "Prop Room",
      desc: "Greek-style decorative pillars.",
      imageUrl: "/assets/stage-pillars.jpg",
    },
    {
      name: "Rode NT1 Microphone",
      cat: "Recording Equipment",
      qty: 5,
      condition: "EXCELLENT",
      location: "Recording Booth",
      desc: "Studio condenser microphone.",
      imageUrl: "/assets/rode-nt1.jpg",
    },
    {
      name: "Zoom H6 Recorder",
      cat: "Recording Equipment",
      qty: 4,
      condition: "GOOD",
      location: "Recording Booth",
      desc: "6-track portable field recorder.",
      imageUrl: "/assets/zoom-h6.jpg",
    },
    {
      name: "Canopy Tent 10x10",
      cat: "Event Infrastructure",
      qty: 15,
      condition: "GOOD",
      location: "Storage Yard",
      desc: "Outdoor event canopy tent.",
      imageUrl: "/assets/canopy-tent.jpg",
    },
    {
      name: "Folding Banquet Table",
      cat: "Event Infrastructure",
      qty: 40,
      condition: "GOOD",
      location: "Storage Yard",
      desc: "6ft folding event table.",
      imageUrl: "/assets/banquet-table.jpg",
    },
    {
      name: "Crowd Barricade",
      cat: "Event Infrastructure",
      qty: 30,
      condition: "FAIR",
      location: "Storage Yard",
      desc: "Steel crowd-control barricade.",
      imageUrl: "/assets/barricade.jpg",
    },
  ];

  const assets: Record<string, { id: string; qty: number }> = {};

  for (const a of assetData) {
    const created = await prisma.asset.create({
      data: {
        name: a.name,
        description: a.desc,
        imageUrl: a.imageUrl,
        categoryId: categories[a.cat],
        totalQuantity: a.qty,
        availableQuantity: a.qty,
        condition: a.condition,
        location: a.location,
        status: "AVAILABLE",
      },
    });

    assets[a.name] = { id: created.id, qty: a.qty };
  }

  async function reserve(assetId: string, quantity: number) {
    await prisma.asset.update({
      where: { id: assetId },
      data: { availableQuantity: { decrement: quantity } },
    });
  }

  await prisma.booking.create({
    data: {
      userId: aditya.id,
      assetId: assets["Canon EOS 90D DSLR"].id,
      quantity: 2,
      startDate: daysFromNow(2),
      endDate: daysFromNow(5),
      purpose: "Photography for the cultural fest opening ceremony.",
      status: "PENDING",
    },
  });

  await prisma.booking.create({
    data: {
      userId: kalpesh.id,
      assetId: assets["JBL EON615 Speaker"].id,
      quantity: 2,
      startDate: daysFromNow(3),
      endDate: daysFromNow(4),
      purpose: "Audio setup for the music night.",
      status: "PENDING",
    },
  });

  const approved = await prisma.booking.create({
    data: {
      userId: krish.id,
      assetId: assets["Folk Dance Costume Set"].id,
      quantity: 10,
      startDate: daysFromNow(1),
      endDate: daysFromNow(6),
      purpose: "Folk dance group performance.",
      status: "APPROVED",
      reviewedById: admin.id,
      reviewNote: "Approved — please collect from the wardrobe.",
    },
  });
  await reserve(approved.assetId, approved.quantity);

  const issued = await prisma.booking.create({
    data: {
      userId: aditya.id,
      assetId: assets["Rode NT1 Microphone"].id,
      quantity: 2,
      startDate: daysFromNow(-2),
      endDate: daysFromNow(3),
      purpose: "Podcast recording sessions.",
      status: "ISSUED",
      reviewedById: admin.id,
      issuedAt: daysFromNow(-2),
      dueDate: daysFromNow(3),
    },
  });
  await reserve(issued.assetId, issued.quantity);

  const overdue = await prisma.booking.create({
    data: {
      userId: kalpesh.id,
      assetId: assets["Zoom H6 Recorder"].id,
      quantity: 1,
      startDate: daysFromNow(-10),
      endDate: daysFromNow(-3),
      purpose: "Field recording for documentary.",
      status: "OVERDUE",
      reviewedById: admin.id,
      issuedAt: daysFromNow(-10),
      dueDate: daysFromNow(-3),
    },
  });
  await reserve(overdue.assetId, overdue.quantity);

  await prisma.booking.create({
    data: {
      userId: krish.id,
      assetId: assets["Canon EOS 90D DSLR"].id,
      quantity: 1,
      startDate: daysFromNow(-20),
      endDate: daysFromNow(-15),
      purpose: "Photo walk event coverage.",
      status: "RETURNED",
      reviewedById: admin.id,
      issuedAt: daysFromNow(-20),
      dueDate: daysFromNow(-15),
      returnedAt: daysFromNow(-15),
    },
  });

  await prisma.booking.create({
    data: {
      userId: aditya.id,
      assetId: assets["Canopy Tent 10x10"].id,
      quantity: 4,
      startDate: daysFromNow(-30),
      endDate: daysFromNow(-25),
      purpose: "Outdoor stalls for fest.",
      status: "RETURNED",
      reviewedById: admin.id,
      issuedAt: daysFromNow(-30),
      dueDate: daysFromNow(-25),
      returnedAt: daysFromNow(-24),
    },
  });

  await prisma.booking.create({
    data: {
      userId: kalpesh.id,
      assetId: assets["Wooden Throne Prop"].id,
      quantity: 2,
      startDate: daysFromNow(1),
      endDate: daysFromNow(2),
      purpose: "Skit.",
      status: "REJECTED",
      reviewedById: admin.id,
      reviewNote: "Reserved for the main drama production on the same dates.",
    },
  });

  await prisma.maintenanceRecord.create({
    data: {
      assetId: assets["Stage Pillars (pair)"].id,
      type: "DAMAGE_REPORT",
      status: "OPEN",
      description: "One pillar has a cracked base after the last event.",
      reportedById: admin.id,
    },
  });

  for (const u of [aditya, kalpesh, krish]) {
    await prisma.notification.create({
      data: {
        userId: u.id,
        type: "INFO",
        title: "Welcome to AssetFlow",
        message: "Browse the catalog and request the assets you need for your events.",
      },
    });
  }

  console.log("Seed complete.");
  console.log("\n  Demo accounts:");
  console.log("   Admin -> abhinav@iitr.ac.in / admin123");
  console.log("   User  -> aditya@iitr.ac.in / user123");
  console.log("   User  -> kalpesh@iitr.ac.in / user123");
  console.log("   User  -> krish@iitr.ac.in / user123\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });