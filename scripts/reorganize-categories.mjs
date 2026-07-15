import { readFileSync, writeFileSync } from "fs";

const products = JSON.parse(readFileSync("public/products.json", "utf-8"));

const categoryMap = {
  // IDs 1-12: Pantry Staples > flour
  flour_ids: [1,2,3,4,5,6,7,8,9,10,11,12],
  // IDs 13-18: Pantry Staples > rice
  rice_ids: [13,14,15,16,17,18],
  // IDs 19-20: Pantry Staples > grains
  grains_ids: [19,20],
  // IDs 21-28: Pantry Staples > beans
  beans_ids: [21,22,23,24,25,26,27,28],
  // IDs 29: Pantry Staples > sugar
  sugar_ids: [29],
  // IDs 30-33: Pantry Staples > baking
  baking_ids: [30,31,32,33],
  // IDs 34-35, 57: Pantry Staples > dairy
  dairy_ids: [34,35,57],
  // IDs 36-46: Pantry Staples > oil
  oil_ids: [36,37,38,39,40,41,42,43,44,45,46],
  // IDs 47-49: Pantry Staples > vinegar
  vinegar_ids: [47,48,49],
  // IDs 50-54, 63: Pantry Staples > nut-butter
  nutbutter_ids: [50,51,52,53,54,63],
  // IDs 55-56: Pantry Staples > sauce
  sauce_ids: [55,56],
  // IDs 58-59: Pantry Staples > honey
  honey_ids: [58,59],
  // IDs 60-62: Pantry Staples > condiment
  condiment_ids: [60,61,62],
  // ID 64: Pantry Staples > spread
  spread_ids: [64],
  // IDs 102-118: Pantry Staples > pasta
  pasta_ids: [102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117],
  // ID 118: Pantry Staples > grains
  grains2_ids: [118],
  // ID 119: Pantry Staples > flour
  flour2_ids: [119],
  // IDs 65-75: Canned Goods > canned-food
  canned_ids: [65,66,67,68,69,70,71,72,73,74,75],
  // IDs 76-89: Frozen Foods > frozen-vegetables
  frozen_veg_ids: [76,77,78,79,80,81,82,83,84,85,86,87,88,89],
  // IDs 90-101: Frozen Foods > frozen-fish
  frozen_fish_ids: [90,91,92,93,94,95,96,97,98,99,100,101],
  // IDs 120-156: Condiments > spices
  spices_ids: [120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156],
  // IDs 157-202: Beverages > beverages
  beverages_ids: [157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202],
  // IDs 203-210: Snacks > snacks
  snacks_ids: [203,204,205,206,207,208,209,210],
  // IDs 211-216: Household > household
  household_ids: [211,212,213,214,215,216],
  // IDs 217-221: Produce & Greens > fresh-vegetables (keep subcategory)
  produce_ids: [217,218,219,220,221],
  // IDs 222-240: Cosmetics > cosmetics
  cosmetics_ids: [222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240],
  // IDs 241-248: Medical > medical (keep subcategory)
  medical_ids: [241,242,243,244,245,246,247,248],
};

let changed = 0;

for (const p of products) {
  if (categoryMap.flour_ids.includes(p.id) || categoryMap.flour2_ids.includes(p.id)) {
    p.category = "Pantry Staples";
    p.subcategory = "flour";
    changed++;
  } else if (categoryMap.rice_ids.includes(p.id)) {
    p.category = "Pantry Staples";
    p.subcategory = "rice";
    changed++;
  } else if (categoryMap.grains_ids.includes(p.id) || categoryMap.grains2_ids.includes(p.id)) {
    p.category = "Pantry Staples";
    p.subcategory = "grains";
    changed++;
  } else if (categoryMap.beans_ids.includes(p.id)) {
    p.category = "Pantry Staples";
    p.subcategory = "beans";
    changed++;
  } else if (categoryMap.sugar_ids.includes(p.id)) {
    p.category = "Pantry Staples";
    p.subcategory = "sugar";
    changed++;
  } else if (categoryMap.baking_ids.includes(p.id)) {
    p.category = "Pantry Staples";
    p.subcategory = "baking";
    changed++;
  } else if (categoryMap.dairy_ids.includes(p.id)) {
    p.category = "Pantry Staples";
    p.subcategory = "dairy";
    changed++;
  } else if (categoryMap.oil_ids.includes(p.id)) {
    p.category = "Pantry Staples";
    p.subcategory = "oil";
    changed++;
  } else if (categoryMap.vinegar_ids.includes(p.id)) {
    p.category = "Pantry Staples";
    p.subcategory = "vinegar";
    changed++;
  } else if (categoryMap.nutbutter_ids.includes(p.id)) {
    p.category = "Pantry Staples";
    p.subcategory = "nut-butter";
    changed++;
  } else if (categoryMap.sauce_ids.includes(p.id)) {
    p.category = "Pantry Staples";
    p.subcategory = "sauce";
    changed++;
  } else if (categoryMap.honey_ids.includes(p.id)) {
    p.category = "Pantry Staples";
    p.subcategory = "honey";
    changed++;
  } else if (categoryMap.condiment_ids.includes(p.id)) {
    p.category = "Pantry Staples";
    p.subcategory = "condiment";
    changed++;
  } else if (categoryMap.spread_ids.includes(p.id)) {
    p.category = "Pantry Staples";
    p.subcategory = "spread";
    changed++;
  } else if (categoryMap.pasta_ids.includes(p.id)) {
    p.category = "Pantry Staples";
    p.subcategory = "pasta";
    changed++;
  } else if (categoryMap.canned_ids.includes(p.id)) {
    p.category = "Canned Goods";
    p.subcategory = "canned-food";
    changed++;
  } else if (categoryMap.frozen_veg_ids.includes(p.id)) {
    p.category = "Frozen Foods";
    p.subcategory = "frozen-vegetables";
    changed++;
  } else if (categoryMap.frozen_fish_ids.includes(p.id)) {
    p.category = "Frozen Foods";
    p.subcategory = "frozen-fish";
    changed++;
  } else if (categoryMap.spices_ids.includes(p.id)) {
    p.category = "Condiments";
    p.subcategory = "spices";
    changed++;
  } else if (categoryMap.beverages_ids.includes(p.id)) {
    p.category = "Beverages";
    p.subcategory = "beverages";
    changed++;
  } else if (categoryMap.snacks_ids.includes(p.id)) {
    p.category = "Snacks";
    p.subcategory = "snacks";
    changed++;
  } else if (categoryMap.household_ids.includes(p.id)) {
    p.category = "Household";
    p.subcategory = "household";
    changed++;
  } else if (categoryMap.produce_ids.includes(p.id)) {
    p.category = "Produce & Greens";
    p.subcategory = "fresh-vegetables";
    changed++;
  } else if (categoryMap.cosmetics_ids.includes(p.id)) {
    p.category = "Cosmetics";
    p.subcategory = "cosmetics";
    changed++;
  } else if (categoryMap.medical_ids.includes(p.id)) {
    p.category = "Medical";
    p.subcategory = "medical";
    changed++;
  }
}

const total = products.length;
console.log(`Changed ${changed} of ${total} products`);

// Verify no duplicates or gaps
const allIds = [
  ...categoryMap.flour_ids, ...categoryMap.flour2_ids,
  ...categoryMap.rice_ids, ...categoryMap.grains_ids, ...categoryMap.grains2_ids,
  ...categoryMap.beans_ids, ...categoryMap.sugar_ids, ...categoryMap.baking_ids,
  ...categoryMap.dairy_ids, ...categoryMap.oil_ids, ...categoryMap.vinegar_ids,
  ...categoryMap.nutbutter_ids, ...categoryMap.sauce_ids, ...categoryMap.honey_ids,
  ...categoryMap.condiment_ids, ...categoryMap.spread_ids, ...categoryMap.pasta_ids,
  ...categoryMap.canned_ids, ...categoryMap.frozen_veg_ids, ...categoryMap.frozen_fish_ids,
  ...categoryMap.spices_ids, ...categoryMap.beverages_ids, ...categoryMap.snacks_ids,
  ...categoryMap.household_ids, ...categoryMap.produce_ids, ...categoryMap.cosmetics_ids,
  ...categoryMap.medical_ids,
].sort((a, b) => a - b);

if (allIds.length !== total) {
  console.error(`ERROR: Expected ${total} IDs but found ${allIds.length}`);
  process.exit(1);
}

for (let i = 0; i < allIds.length; i++) {
  if (allIds[i] !== i + 1) {
    console.error(`ERROR: Gap or duplicate at index ${i}, expected ${i+1} got ${allIds[i]}`);
    process.exit(1);
  }
}
console.log("All 248 IDs accounted for, no gaps or duplicates");

writeFileSync("public/products.json", JSON.stringify(products, null, 2) + "\n", "utf-8");
console.log("Done - public/products.json updated");
