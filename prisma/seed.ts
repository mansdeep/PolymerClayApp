import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const projects = [
  {
    name: "Stud / dangle earrings",
    usage: "Everyday jewellery, gifts, market sales",
    procedure:
      "Roll clay to 2–3mm on a tile. Cut shapes with mini cutters or a blade. Pierce a hole near the top with a needle tool (for dangles) before baking. Bake, sand edges, seal. Glue flat pad studs with E6000, or open a jump ring and attach earring hooks.",
    difficulty: "Easy",
  },
  {
    name: "Marbled / terrazzo earrings",
    usage: "Statement jewellery",
    procedure:
      "Twist 2–4 colours together loosely (don't over-blend), roll flat. For terrazzo, press small clay flakes into a white sheet and roll smooth. Cut, pierce, bake, assemble as above.",
    difficulty: "Easy",
  },
  {
    name: "Trinket / ring dish",
    usage: "Holds rings, earrings, keys, spices",
    procedure:
      "Roll a 4–5mm slab, cut a circle. Drape over the outside of a small oven-safe bowl or press into the inside to form a lip. Smooth edges with a damp finger. Bake on the mould. Optional: press real leaves/lace for texture, or paint the well with gold after baking.",
    difficulty: "Easy",
  },
  {
    name: "Beads (round, tube, disc)",
    usage: "Necklaces, bracelets, garlands",
    procedure:
      "Roll uniform balls (weigh clay for consistency). Pierce with a bamboo skewer and suspend across a baking tray so they don't flatten. Bake, sand, string on cord or elastic.",
    difficulty: "Easy",
  },
  {
    name: "Pendant / necklace focal",
    usage: "Jewellery centrepiece",
    procedure:
      "Cut or sculpt a larger shape (5mm thick for strength). Add a hole or bake in a metal bail. Layer canes, foil, or mica powder for detail. Seal, hang on a chain.",
    difficulty: "Medium",
  },
  {
    name: "Keychain charms",
    usage: "Bag/keys decoration, sellable items",
    procedure:
      "Sculpt or cut a chunky shape at least 6mm thick (thin pieces snap). Insert an eye pin into the top before baking, or drill a hole after. Bake, seal, attach a split ring and chain.",
    difficulty: "Easy",
  },
  {
    name: "Fridge magnets",
    usage: "Functional decor",
    procedure:
      "Make a flat shape 3–4mm thick. Bake. Glue a neodymium disc magnet to the back with strong adhesive. Miniature food (croissants, sushi) is popular — build with layered colours and a soft pastel bake dusting.",
    difficulty: "Easy",
  },
  {
    name: "Miniature food / dollhouse items",
    usage: "Display, dollhouses, charms",
    procedure:
      "Use translucent clay mixed with colour for realism. Sculpt with dental tools and blades. Add chalk pastel shading for browning. Gloss glaze for sauces/icing, matte varnish for bread. Bake at low end of range to avoid scorching.",
    difficulty: "Hard",
  },
  {
    name: "Decorative bowl / catchall (coil or slab)",
    usage: "Desk tidy, fruit-shaped decor",
    procedure:
      "Coil: roll long snakes, spiral them up from a base disc, blend seams inside. Slab: cut panels, join with a little liquid clay, support with crumpled foil while baking.",
    difficulty: "Medium",
  },
  {
    name: "Wall art / hanging",
    usage: "Home decor",
    procedure:
      "Cut abstract organic shapes or tiles, texture them, pierce holes. Bake. Connect with jump rings or string onto a dowel to hang.",
    difficulty: "Medium",
  },
  {
    name: "Coasters",
    usage: "Protect surfaces",
    procedure:
      "Roll a large even 5–6mm slab (use thickness guides). Cut with a large square/circle template. Bake flat between two tiles to keep it from warping. Seal with a water-resistant resin or polyurethane — standard glaze isn't very heat/water proof.",
    difficulty: "Medium",
  },
  {
    name: "Incense / cone holder",
    usage: "Functional",
    procedure:
      "Form a small dish or shaped base, press a hole for the incense stick using a skewer at the correct diameter. Ensure the tray catches ash. Bake.",
    difficulty: "Medium",
  },
  {
    name: "Buttons / embellishments",
    usage: "Sewing, cards, scrapbooking",
    procedure:
      "Cut small discs, pierce 2 or 4 holes with a needle, texture the surface. Bake.",
    difficulty: "Easy",
  },
  {
    name: "Napkin rings / candle collars",
    usage: "Table settings",
    procedure:
      "Wrap a slab or coils around a cardboard tube covered in paper (so it releases). Bake on the tube.",
    difficulty: "Medium",
  },
  {
    name: "Hair accessories (clips, combs)",
    usage: "Wearable",
    procedure:
      "Make flat decorative shapes, bake, then glue to metal clip or comb blanks with E6000. Keep them lightweight.",
    difficulty: "Easy",
  },
  {
    name: "Bookmarks / planner clips",
    usage: "Stationery",
    procedure:
      "Thin flat shapes attached to a large paperclip or metal bookmark blank; bake the clay separately then glue.",
    difficulty: "Easy",
  },
  {
    name: "Ornaments (holiday)",
    usage: "Seasonal decor",
    procedure:
      "Cut shapes with cookie cutters, stamp texture or names, make a hole for ribbon. Bake, paint or glaze, thread ribbon.",
    difficulty: "Easy",
  },
  {
    name: "Faux ceramic vase (over glass/jar)",
    usage: "Decor, dried flowers",
    procedure:
      "Cover a clean glass jar with a thin clay sheet, blend seams, add texture or sculpted flowers. Bake the whole jar (glass is oven-safe at these temps).",
    difficulty: "Hard",
  },
  {
    name: "Magnetic pins / brooches",
    usage: "Fashion",
    procedure:
      "Sculpt a flat-backed design, bake, glue a bar pin or magnetic back.",
    difficulty: "Easy",
  },
];

const techniques = [
  {
    name: "Skinner blend",
    purpose: "Smooth colour gradients (earrings, beads)",
    howTo:
      "Cut two colours into triangles, place together in a rectangle, fold and roll repeatedly through a pasta machine in the same direction until a gradient forms.",
    difficulty: "Medium",
  },
  {
    name: "Caning (millefiori)",
    purpose: "Repeating patterns — flowers, faces, geometric",
    howTo:
      "Build a design in a thick log by arranging coloured snakes/sheets, then reduce (gently stretch/roll) so the pattern shrinks. Slice thin cross-sections and apply to a base.",
    difficulty: "Hard",
  },
  {
    name: "Mokume gane",
    purpose: "Organic layered ghost patterns",
    howTo:
      "Stack thin sheets of different colours plus metal leaf, press distortions into the stack with tools/balls, then shave off thin horizontal slices to reveal the pattern.",
    difficulty: "Hard",
  },
  {
    name: "Mica shift",
    purpose: "Faux 3D metallic texture on a flat surface",
    howTo:
      "Use mica/pearl clay, stack and compress to align particles, impress a deep texture stamp, slice off the raised bits flat — the image appears like a hologram.",
    difficulty: "Hard",
  },
  {
    name: "Texture stamping",
    purpose: "Surface interest",
    howTo:
      "Press rubber stamps, lace, mesh, sandpaper, leaves, or textured rollers into conditioned clay. Dust the stamp with cornstarch to prevent sticking.",
    difficulty: "Easy",
  },
  {
    name: "Faux stone (granite, marble, turquoise)",
    purpose: "Realistic beads and dishes",
    howTo:
      "Marble greys/black/white with specks of embossing powder for granite; for turquoise, crumble teal clay, mix with bronze, fill veins with gold acrylic after baking.",
    difficulty: "Medium",
  },
  {
    name: "Silkscreen / image transfer",
    purpose: "Printed patterns on clay",
    howTo:
      "Apply acrylic paint through a fine silkscreen onto raw clay; or print a laser (toner) image, press face-down onto clay, wet the paper and rub away to leave the ink.",
    difficulty: "Medium",
  },
  {
    name: "Sgraffito",
    purpose: "Carved line drawings",
    howTo:
      "Paint or apply a contrasting clay layer, let it firm slightly, then scratch a design through to reveal the colour beneath.",
    difficulty: "Medium",
  },
  {
    name: "Inlay",
    purpose: "Crisp multi-colour designs flush with the surface",
    howTo:
      "Cut a shape out of a base sheet, fit a matching piece of another colour into the gap, roll flush.",
    difficulty: "Medium",
  },
  {
    name: "Liquid clay accents",
    purpose: "Faux glass, enamel, resin wells, glue",
    howTo:
      "Pour tinted liquid polymer clay into recessed areas or over surfaces; bake to a glossy finish. Also used to bond raw-to-baked pieces.",
    difficulty: "Easy",
  },
  {
    name: "Alcohol ink / watercolour effect",
    purpose: "Translucent colour washes",
    howTo:
      "Drop alcohol ink onto translucent or white clay for a tie-dye look; blend with a brush before baking.",
    difficulty: "Easy",
  },
  {
    name: "Foil & leaf",
    purpose: "Metallic shine",
    howTo:
      "Press metal leaf or transfer foil onto raw clay; crackle it by stretching the clay. Seal after baking (foil rubs off otherwise).",
    difficulty: "Easy",
  },
];

const finishes = [
  {
    name: "Sanding + buffing",
    result: "Natural satin/glass sheen, no coating",
    notes:
      "Wet-sand 400→2000 grit, buff on denim or a muslin wheel. Best professional look.",
    difficulty: "Medium",
  },
  {
    name: "Gloss varnish (water-based PU or Sculpey Glaze)",
    result: "Shiny, protective",
    notes:
      "2–3 thin coats, dry between. Avoid nail polish top coat — it stays tacky over time.",
    difficulty: "Easy",
  },
  {
    name: "Matte varnish",
    result: "Flat, natural finish",
    notes: "Good for faux food (bread, matte ceramics).",
    difficulty: "Easy",
  },
  {
    name: "Resin coat",
    result: "Thick glassy dome, durable",
    notes:
      "For coasters, statement pendants. Mix 2-part epoxy, pour, pop bubbles, cure 24h.",
    difficulty: "Hard",
  },
  {
    name: "Acrylic paint / mica powder / pastels",
    result: "Colour, shading, antiquing",
    notes:
      "Apply mica/pastels before baking (they set into the surface); acrylic detail after. Always seal painted pieces.",
    difficulty: "Medium",
  },
];

async function main() {
  await prisma.project.deleteMany();
  await prisma.technique.deleteMany();
  await prisma.finish.deleteMany();

  await prisma.project.createMany({ data: projects });
  await prisma.technique.createMany({ data: techniques });
  await prisma.finish.createMany({ data: finishes });

  console.log(
    `Seeded ${projects.length} projects, ${techniques.length} techniques, ${finishes.length} finishes.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
