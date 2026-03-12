import { useState, useEffect, useRef, useMemo } from "react";
import * as d3 from "d3";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const currentMonth = new Date().getMonth();

const ORIGIN_COORDS = {
  // California
  "Salinas, CA": [-121.66, 36.68],
  "Watsonville, CA": [-121.76, 36.91],
  "Oxnard, CA": [-119.18, 34.20],
  "Santa Maria, CA": [-120.44, 34.95],
  "Stockton, CA": [-121.29, 37.96],
  "Linden, CA": [-121.08, 38.03],
  "Fresno, CA": [-119.77, 36.74],
  "Tulare County, CA": [-119.35, 36.21],
  "San Joaquin Valley, CA": [-119.42, 36.78],
  "Coachella Valley, CA": [-116.17, 33.68],
  "Imperial Valley, CA": [-115.35, 33.05],
  "Blythe, CA": [-114.60, 33.61],
  "Lake County, CA": [-122.75, 39.10],
  "Sacramento Valley, CA": [-121.49, 38.58],
  "Sonoma, CA": [-122.46, 38.29],
  "Gilroy, CA": [-121.57, 37.00],
  "Bakersfield, CA": [-119.02, 35.37],
  "Firebaugh, CA": [-120.46, 36.86],
  "Lompoc, CA": [-120.46, 34.64],
  "Ventura County, CA": [-119.07, 34.28],
  "San Luis Obispo, CA": [-120.66, 35.28],
  "Woodland, CA": [-121.77, 38.68],
  "Brawley, CA": [-115.53, 32.98],
  "Napa Valley, CA": [-122.31, 38.50],
  "El Centro, CA": [-115.56, 32.79],
  "Castroville, CA": [-121.76, 36.76],
  "Lodi, CA": [-121.27, 38.13],
  "Watsonville/Pajaro, CA": [-121.77, 36.90],
  // Florida
  "Plant City, FL": [-82.12, 28.02],
  "Immokalee, FL": [-81.42, 26.42],
  "Belle Glade, FL": [-80.67, 26.68],
  "Homestead, FL": [-80.50, 25.47],
  "Polk County, FL": [-81.95, 28.04],
  "Indian River, FL": [-80.48, 27.68],
  "Hendry County, FL": [-81.20, 26.50],
  "Hastings, FL": [-81.51, 29.71],
  "Palmetto, FL": [-82.57, 27.52],
  "Lake Wales, FL": [-81.59, 27.90],
  "Wauchula, FL": [-81.81, 27.55],
  "Zellwood, FL": [-81.61, 28.72],
  // Arizona
  "Yuma, AZ": [-114.63, 32.69],
  "Nogales, AZ": [-110.94, 31.34],
  "Buckeye, AZ": [-112.58, 33.37],
  "Willcox, AZ": [-109.83, 32.25],
  // Washington
  "Yakima, WA": [-120.51, 46.60],
  "Wenatchee, WA": [-120.31, 47.42],
  "Walla Walla, WA": [-118.34, 46.06],
  "Whatcom County, WA": [-122.40, 48.85],
  "Moses Lake, WA": [-119.28, 47.13],
  "Othello, WA": [-118.99, 46.82],
  "Pasco, WA": [-119.10, 46.24],
  "Quincy, WA": [-119.85, 47.23],
  "Skagit Valley, WA": [-122.34, 48.42],
  // Oregon
  "Medford, OR": [-122.87, 42.33],
  "Hood River, OR": [-121.52, 45.71],
  "Hermiston, OR": [-119.29, 45.84],
  "Nyssa, OR": [-117.00, 43.88],
  "Marion County, OR": [-122.88, 44.93],
  "Willamette Valley, OR": [-123.02, 44.60],
  "Corvallis, OR": [-123.26, 44.56],
  "Grants Pass, OR": [-123.33, 42.44],
  "Klamath Falls, OR": [-121.78, 42.22],
  // Idaho
  "Idaho Falls, ID": [-112.03, 43.49],
  "Nampa, ID": [-116.56, 43.57],
  "Twin Falls, ID": [-114.46, 42.56],
  "Buhl, ID": [-114.76, 42.60],
  "Rupert, ID": [-113.68, 42.62],
  "Burley, ID": [-113.79, 42.54],
  // Georgia / Southeast
  "Cordele, GA": [-83.78, 31.96],
  "Fort Valley, GA": [-83.89, 32.55],
  "Alma, GA": [-82.46, 31.54],
  "Vidalia, GA": [-82.41, 32.21],
  "Tifton, GA": [-83.51, 31.45],
  "Moultrie, GA": [-83.79, 31.18],
  "Bainbridge, GA": [-84.58, 30.91],
  "Cairo, GA": [-84.20, 30.88],
  // Carolinas
  "Spartanburg, SC": [-81.93, 34.95],
  "Faison, NC": [-78.12, 35.12],
  "Chadbourn, NC": [-78.83, 34.32],
  "Elizabethtown, NC": [-78.60, 34.63],
  "Clinton, NC": [-78.32, 34.99],
  "Castle Hayne, NC": [-77.89, 34.33],
  "Rocky Mount, NC": [-77.79, 35.94],
  "Goldsboro, NC": [-77.99, 35.38],
  // Virginia / Mid-Atlantic
  "Martinsburg, WV": [-77.96, 39.46],
  "Winchester, VA": [-78.16, 39.19],
  "Bridgewater, VA": [-78.97, 38.38],
  "Shore of Virginia": [-75.65, 37.60],
  "Eastern Shore, VA": [-75.65, 37.55],
  // New Jersey / New York
  "Hammonton, NJ": [-74.80, 39.64],
  "Vineland, NJ": [-75.02, 39.49],
  "Watkins Glen, NY": [-76.87, 42.38],
  "Hudson Valley, NY": [-73.95, 41.55],
  "Finger Lakes, NY": [-77.05, 42.65],
  "Long Island, NY": [-72.70, 40.95],
  // Maine / Northeast
  "Aroostook County, ME": [-68.01, 46.65],
  // Mississippi / Alabama
  "Vardaman, MS": [-89.18, 33.88],
  "Crystal Springs, MS": [-90.36, 31.98],
  "Pontotoc, MS": [-89.00, 34.25],
  "Chilton County, AL": [-86.72, 32.85],
  "Brewton, AL": [-87.07, 31.10],
  // Texas
  "Rio Grande Valley, TX": [-98.23, 26.20],
  "Pecos, TX": [-103.49, 31.42],
  "Lubbock, TX": [-101.86, 33.58],
  "Hatch, NM": [-107.15, 32.66],
  "Uvalde, TX": [-99.79, 29.21],
  "Laredo, TX": [-99.51, 27.51],
  "Presidio, TX": [-104.37, 29.56],
  "Edinburg, TX": [-98.16, 26.30],
  "Weslaco, TX": [-97.99, 26.16],
  "Donna, TX": [-98.05, 26.17],
  // Colorado / New Mexico
  "Rocky Ford, CO": [-103.72, 38.05],
  "Greeley, CO": [-104.71, 40.42],
  "Grand Junction, CO": [-108.55, 39.06],
  "Center, CO": [-106.10, 37.75],
  "Olathe, CO": [-107.98, 38.60],
  "Alamosa, CO": [-105.87, 37.47],
  // Upper Midwest
  "Red River Valley, ND": [-97.08, 47.92],
  "Rochester, MN": [-92.47, 44.02],
  "Rochelle, IL": [-89.07, 41.92],
  "Holland, MI": [-86.10, 42.79],
  "Traverse City, MI": [-85.62, 44.76],
  "Grand Rapids, MI": [-85.66, 42.96],
  "Stockbridge, MI": [-84.18, 42.45],
  "Hart, MI": [-86.35, 43.69],
  "Oceana County, MI": [-86.28, 43.80],
  "Eau Claire, WI": [-91.50, 44.81],
  "Door County, WI": [-87.28, 44.95],
  "Kewaunee, WI": [-87.50, 44.46],
  // California additional
  "Porterville, CA": [-119.02, 36.06],
  "Lindsay, CA": [-119.09, 36.20],
  "Delano, CA": [-119.24, 35.77],
  "Dinuba, CA": [-119.39, 36.54],
  "Reedley, CA": [-119.45, 36.60],
  "Parlier, CA": [-119.53, 36.61],
  "Selma, CA": [-119.61, 36.57],
  "Coalinga, CA": [-120.36, 36.14],
  "Visalia, CA": [-119.29, 36.33],
};

const DEST_COORDS = {
  "Chicago, IL": [-87.63, 41.88],
  "New York, NY": [-74.01, 40.71],
  "Dallas, TX": [-96.80, 32.78],
  "Atlanta, GA": [-84.39, 33.75],
  "Philadelphia, PA": [-75.17, 39.95],
  "Boston, MA": [-71.06, 42.36],
  "Detroit, MI": [-83.05, 42.33],
  "Denver, CO": [-104.98, 39.74],
  "Houston, TX": [-95.37, 29.76],
  "Los Angeles, CA": [-118.24, 34.05],
  "Miami, FL": [-80.19, 25.77],
  "Minneapolis, MN": [-93.27, 44.98],
  "Memphis, TN": [-90.05, 35.15],
  "Kansas City, MO": [-94.58, 39.10],
  "Seattle, WA": [-122.33, 47.61],
  "Phoenix, AZ": [-112.07, 33.45],
  "St. Louis, MO": [-90.20, 38.63],
  "Baltimore, MD": [-76.61, 39.29],
  "Charlotte, NC": [-80.84, 35.23],
  "Nashville, TN": [-86.78, 36.17],
  "Portland, OR": [-122.68, 45.52],
  "San Francisco, CA": [-122.42, 37.77],
  "Las Vegas, NV": [-115.14, 36.17],
  "Pittsburgh, PA": [-79.98, 40.44],
  "Cincinnati, OH": [-84.51, 39.10],
  "Cleveland, OH": [-81.69, 41.50],
  "Indianapolis, IN": [-86.16, 39.77],
  "Columbus, OH": [-82.99, 39.96],
  "San Antonio, TX": [-98.49, 29.42],
  "New Orleans, LA": [-90.07, 29.95],
  "Tampa, FL": [-82.46, 27.95],
  "Jacksonville, FL": [-81.66, 30.33],
  "Richmond, VA": [-77.46, 37.54],
  "Albuquerque, NM": [-106.65, 35.08],
  "Salt Lake City, UT": [-111.89, 40.76],
  "Omaha, NE": [-95.94, 41.26],
};

const PRODUCE = [
  // ─── BERRIES ───────────────────────────────────────────────────────────────
  { name: "Strawberries", emoji: "🍓", category: "Berries", peakMonths: [1,2,3,4,5,6],
    origins: ["Watsonville, CA","Plant City, FL","Oxnard, CA","Brawley, CA"],
    destinations: ["Chicago, IL","New York, NY","Dallas, TX","Atlanta, GA","Philadelphia, PA","Los Angeles, CA"],
    temp: "32–34°F", equipment: "FTL Reefer",
    notes: "One of the highest-urgency reefer loads you'll book. FL ships Dec–Mar; CA takes over Apr–Oct. 3–5 day transit max — carriers must pre-cool to 32°F before loading. Missed pickup = scrapped load. Premium rates justified." },
  { name: "Blueberries", emoji: "🫐", category: "Berries", peakMonths: [3,4,5,6,7,8],
    origins: ["Hammonton, NJ","Alma, GA","Stockbridge, MI","Whatcom County, WA","Elizabethtown, NC"],
    destinations: ["New York, NY","Chicago, IL","Boston, MA","Philadelphia, PA","Detroit, MI","Atlanta, GA"],
    temp: "32–34°F", equipment: "FTL Reefer",
    notes: "Southeast starts April; NJ/NC peak June; Michigan July–Aug; PNW Aug–Sep. Strong demand supports FTL volumes throughout the window. Fragile — carriers need air ride suspension. Good eastbound backhaul opportunity out of GA/NC." },
  { name: "Cranberries", emoji: "🍒", category: "Berries", peakMonths: [8,9,10,11],
    origins: ["Eau Claire, WI","Door County, WI","Kewaunee, WI"],
    destinations: ["Chicago, IL","New York, NY","Boston, MA","Philadelphia, PA","Detroit, MI","Minneapolis, MN"],
    temp: "36–40°F", equipment: "FTL Reefer / FTL Dry Van",
    notes: "Wisconsin produces 60%+ of US cranberries. Harvest Sep–Oct creates a compressed, high-volume window. Thanksgiving surge spikes demand for dry van capacity — book lanes 6–8 weeks early. Good regional opportunity for Midwest brokers." },
  { name: "Cherries", emoji: "🍒", category: "Stone Fruit", peakMonths: [4,5,6,7],
    origins: ["Yakima, WA","Traverse City, MI","Linden, CA","Hood River, OR"],
    destinations: ["Chicago, IL","New York, NY","Los Angeles, CA","Miami, FL","Boston, MA","Dallas, TX"],
    temp: "30–32°F", equipment: "FTL Reefer",
    notes: "Extremely compressed 6–8 week window. PNW dominates. High $/lb commodity — shippers pay premium rates, but carrier standards are strict. Pre-cooling and gentle handling non-negotiable. Strong WA→Midwest and WA→East lanes." },
  { name: "Grapes", emoji: "🍇", category: "Berries", peakMonths: [5,6,7,8,9,10,11],
    origins: ["Coachella Valley, CA","San Joaquin Valley, CA","Lodi, CA"],
    destinations: ["New York, NY","Chicago, IL","Miami, FL","Philadelphia, PA","Dallas, TX","Atlanta, GA"],
    temp: "30–32°F", equipment: "FTL Reefer",
    notes: "CA produces 90%+ of US table grapes. Coachella Valley starts May; San Joaquin peaks Jul–Oct. Long, reliable season makes this a bread-and-butter FTL reefer lane. SO2 pads in packaging — ensure carrier is aware. Strong export volume through LA and Miami." },

  // ─── MELONS ─────────────────────────────────────────────────────────────────
  { name: "Watermelon", emoji: "🍉", category: "Melons", peakMonths: [4,5,6,7,8],
    origins: ["Cordele, GA","Hermiston, OR","Lubbock, TX","Blythe, CA","Uvalde, TX"],
    destinations: ["Chicago, IL","New York, NY","Atlanta, GA","Memphis, TN","Kansas City, MO","Dallas, TX","Houston, TX"],
    temp: "50–60°F", equipment: "FTL Dry Van / Flatbed",
    notes: "One of the highest-cube produce loads — 40,000–44,000 lbs on a flatbed or dry van. GA ships May–Jun, TX follows, OR takes over Jul–Aug. Lower rate per mile but high volume makes up for it. Good southbound reloads out of GA/TX in summer." },
  { name: "Cantaloupe", emoji: "🍈", category: "Melons", peakMonths: [4,5,6,7,8],
    origins: ["Yuma, AZ","Imperial Valley, CA","Rocky Ford, CO","Pecos, TX","Edinburg, TX"],
    destinations: ["Chicago, IL","Dallas, TX","Houston, TX","Los Angeles, CA","Denver, CO","Kansas City, MO"],
    temp: "36–41°F", equipment: "FTL Reefer",
    notes: "Southwest dominates May–Aug. AZ/CA→Midwest is the primary corridor. Rocky Ford CO commands a premium for specialty buyers. Ethylene producer — do not co-load with strawberries, leafy greens." },
  { name: "Honeydew", emoji: "🍈", category: "Melons", peakMonths: [5,6,7,8,9],
    origins: ["Imperial Valley, CA","El Centro, CA","Edinburg, TX"],
    destinations: ["Chicago, IL","New York, NY","Los Angeles, CA","Dallas, TX","Atlanta, GA"],
    temp: "45–50°F", equipment: "FTL Reefer",
    notes: "Often shipped on the same trucks as cantaloupe — compatible temp requirements. CA Imperial Valley is the main domestic source. Longer shelf life than most melons (3–4 weeks) so transit time is less critical." },

  // ─── CITRUS ──────────────────────────────────────────────────────────────────
  { name: "Oranges", emoji: "🍊", category: "Citrus", peakMonths: [0,1,2,3,4,10,11],
    origins: ["Polk County, FL","Tulare County, CA","Indian River, FL","Rio Grande Valley, TX"],
    destinations: ["Chicago, IL","New York, NY","Philadelphia, PA","Boston, MA","Atlanta, GA","Detroit, MI"],
    temp: "38–48°F", equipment: "FTL Reefer",
    notes: "High-volume, reliable reefer lanes Oct–May. FL dominates with multiple trips per week out of Polk/Indian River. CA navel season Dec–May creates strong westbound-to-east opportunities. Juice orange volume out of FL is massive — often dedicated shipper contracts." },
  { name: "Grapefruit", emoji: "🍋", category: "Citrus", peakMonths: [0,1,2,3,10,11],
    origins: ["Indian River, FL","Rio Grande Valley, TX","Coachella Valley, CA"],
    destinations: ["New York, NY","Chicago, IL","Philadelphia, PA","Boston, MA","Detroit, MI","Miami, FL"],
    temp: "50–60°F", equipment: "FTL Reefer",
    notes: "FL Indian River is the premium source — consistent broker lanes Nov–Apr. TX Rio Grande Valley peaks Jan–Mar and creates strong cross-country opportunities. Slightly warmer temp requirement than oranges — verify before co-loading." },
  { name: "Lemons", emoji: "🍋", category: "Citrus", peakMonths: [0,1,2,3,4,5,6,7,8,9,10,11],
    origins: ["Ventura County, CA","Tulare County, CA","Yuma, AZ"],
    destinations: ["Chicago, IL","New York, NY","Dallas, TX","Philadelphia, PA","Boston, MA","Atlanta, GA"],
    temp: "50–55°F", equipment: "FTL Reefer",
    notes: "True year-round commodity — one of the most consistent reefer lanes out of CA. Ventura County leads. Good for maintaining CA→East relationships during slower produce seasons. Watch for Nogales import surges in winter." },
  { name: "Limes", emoji: "🍈", category: "Citrus", peakMonths: [0,1,2,3,4,5,6,7,8,9,10,11],
    origins: ["Nogales, AZ","Laredo, TX"],
    destinations: ["Chicago, IL","New York, NY","Dallas, TX","Houston, TX","Miami, FL","Los Angeles, CA"],
    temp: "48–55°F", equipment: "FTL Reefer",
    notes: "90%+ are Mexican imports — Nogales and Laredo are the only real origin points for a broker. Year-round with summer peak (Cinco de Mayo, summer bar season). Price-volatile commodity — rates can spike 3–4x in a shortage. Strong Laredo→Houston and Nogales→Chicago corridors." },
  { name: "Tangerines / Mandarins", emoji: "🍊", category: "Citrus", peakMonths: [10,11,0,1,2],
    origins: ["Tulare County, CA","Polk County, FL","Brawley, CA"],
    destinations: ["Chicago, IL","New York, NY","Boston, MA","Philadelphia, PA","Dallas, TX","Atlanta, GA"],
    temp: "38–48°F", equipment: "FTL Reefer",
    notes: "Holiday season surge makes Nov–Dec a high-demand window. Clementine gift boxes drive enormous retail volume. CA Tulare County dominates. Book capacity by October — reefer gets tight as citrus, holiday produce, and Christmas trees compete." },

  // ─── TREE FRUIT ──────────────────────────────────────────────────────────────
  { name: "Apples", emoji: "🍎", category: "Tree Fruit", peakMonths: [7,8,9,10,11,0,1,2],
    origins: ["Wenatchee, WA","Yakima, WA","Martinsburg, WV","Grand Rapids, MI","Winchester, VA"],
    destinations: ["Chicago, IL","New York, NY","Los Angeles, CA","Dallas, TX","Miami, FL","Philadelphia, PA","Boston, MA"],
    temp: "30–32°F", equipment: "FTL Reefer",
    notes: "One of the most dependable year-round reefer lanes in produce. WA ships 60%+ of US supply from cold storage Aug–May. Yakima/Wenatchee→Midwest and →East are bread-and-butter runs. Long storage season means consistent volume — great for maintaining carrier relationships." },
  { name: "Pears", emoji: "🍐", category: "Tree Fruit", peakMonths: [6,7,8,9,10,11],
    origins: ["Medford, OR","Yakima, WA","Hood River, OR"],
    destinations: ["Chicago, IL","New York, NY","Los Angeles, CA","Seattle, WA","Denver, CO","Dallas, TX"],
    temp: "29–31°F", equipment: "FTL Reefer",
    notes: "Oregon Medford/Hood River is the undisputed hub. Ships Aug–Mar from cold storage — reliable lane to build around. Coldest temp requirement in tree fruit (29°F) — ensure carrier has accurate temp controls." },
  { name: "Peaches", emoji: "🍑", category: "Stone Fruit", peakMonths: [4,5,6,7,8],
    origins: ["Fresno, CA","Spartanburg, SC","Fort Valley, GA","Grand Junction, CO","Chilton County, AL"],
    destinations: ["New York, NY","Chicago, IL","Philadelphia, PA","Boston, MA","Detroit, MI","Atlanta, GA"],
    temp: "31–32°F", equipment: "FTL Reefer",
    notes: "Compressed May–Sep season creates strong, time-sensitive lanes. GA/SC leads East Coast early; CA extends through Sep. Fragile load — transit claims are common with inexperienced carriers. Position near GA/SC in May–Jun and CA in Jul–Sep." },
  { name: "Nectarines", emoji: "🍑", category: "Stone Fruit", peakMonths: [4,5,6,7,8],
    origins: ["Fresno, CA","Reedley, CA","Dinuba, CA"],
    destinations: ["Chicago, IL","New York, NY","Dallas, TX","Philadelphia, PA","Boston, MA","Los Angeles, CA"],
    temp: "31–32°F", equipment: "FTL Reefer",
    notes: "Virtually all domestic nectarines come from CA San Joaquin Valley. Runs parallel to peach season — same carriers, same lanes, often same shippers. More bruise-sensitive than peaches; single-layer pallet pack is standard." },
  { name: "Plums", emoji: "🟣", category: "Stone Fruit", peakMonths: [5,6,7,8,9],
    origins: ["Fresno, CA","San Joaquin Valley, CA","Selma, CA"],
    destinations: ["Chicago, IL","New York, NY","Los Angeles, CA","Philadelphia, PA","Dallas, TX"],
    temp: "31–32°F", equipment: "FTL Reefer",
    notes: "CA San Joaquin Valley dominates. Runs alongside peach and nectarine season — good for building full shipper relationships out of Fresno/Selma. Dried prune volume out of same region ships dry van year-round on a separate cadence." },
  { name: "Avocados", emoji: "🥑", category: "Tree Fruit", peakMonths: [0,1,2,3,4,5,6,7,8,9,10,11],
    origins: ["Nogales, AZ","Laredo, TX","San Diego County, CA","Ventura County, CA"],
    destinations: ["Chicago, IL","New York, NY","Dallas, TX","Houston, TX","Los Angeles, CA","Miami, FL","Atlanta, GA"],
    temp: "45–55°F", equipment: "FTL Reefer",
    notes: "One of the fastest-growing and most consistent reefer lanes in produce — demand up 300%+ over the past decade. 90%+ Mexican imports via Nogales and Laredo. Year-round, predictable volume. Strong Laredo→Dallas→Chicago corridor. CA domestic Hass Apr–Sep supplements supply." },
  { name: "Mangoes", emoji: "🥭", category: "Tropical", peakMonths: [3,4,5,6,7,8],
    origins: ["Nogales, AZ","Laredo, TX","Rio Grande Valley, TX"],
    destinations: ["Chicago, IL","New York, NY","Los Angeles, CA","Dallas, TX","Houston, TX","Miami, FL"],
    temp: "50–55°F", equipment: "FTL Reefer",
    notes: "100% imported — Nogales and Laredo are the only domestic broker pickup points. Peak Apr–Sep aligns with heavy Nogales/Laredo reefer season. Extremely chilling-sensitive below 50°F — carrier errors are costly. Strong demand in Latin and Asian grocery distribution centers." },

  // ─── LEAFY GREENS ────────────────────────────────────────────────────────────
  { name: "Lettuce", emoji: "🥬", category: "Leafy Greens", peakMonths: [0,1,2,3,4,8,9,10,11],
    origins: ["Salinas, CA","Yuma, AZ","Santa Maria, CA","Imperial Valley, CA"],
    destinations: ["Chicago, IL","New York, NY","Dallas, TX","Atlanta, GA","Miami, FL","Philadelphia, PA","Houston, TX"],
    temp: "32–36°F", equipment: "FTL Reefer",
    notes: "Highest-volume leafy green in the US — constant FTL demand year-round. The Salinas→Yuma handoff (Oct and Apr) is critical to track: capacity disruptions happen at transition. CA→Midwest and CA→East are core broker lanes. Bagged salad adds value-added volume to same corridor." },
  { name: "Spinach", emoji: "🥬", category: "Leafy Greens", peakMonths: [0,1,2,3,4,8,9,10,11],
    origins: ["Salinas, CA","Yuma, AZ","Santa Maria, CA"],
    destinations: ["Chicago, IL","New York, NY","Dallas, TX","Philadelphia, PA","Boston, MA","Atlanta, GA"],
    temp: "32°F", equipment: "FTL Reefer",
    notes: "Bagged spinach is one of the highest-value leafy green loads — good revenue per mile. CA/AZ mirror the lettuce seasonal pattern. 7–10 day shelf life means urgency is real. Salinas is the dominant origin." },
  { name: "Kale", emoji: "🥬", category: "Leafy Greens", peakMonths: [0,1,2,3,4,5,8,9,10,11],
    origins: ["Salinas, CA","Yuma, AZ","Santa Maria, CA"],
    destinations: ["Chicago, IL","New York, NY","Boston, MA","Philadelphia, PA","Dallas, TX","Atlanta, GA"],
    temp: "32–36°F", equipment: "FTL Reefer",
    notes: "Demand has exploded over the past decade. Heartier than other leafy greens — 2–3 week shelf life reduces urgency slightly. Ships from same CA/AZ origins as lettuce and broccoli; easy to bundle shipper relationships." },
  { name: "Broccoli", emoji: "🥦", category: "Brassicas", peakMonths: [0,1,2,3,4,8,9,10,11],
    origins: ["Salinas, CA","Yuma, AZ","Santa Maria, CA","Imperial Valley, CA"],
    destinations: ["Chicago, IL","New York, NY","Dallas, TX","Philadelphia, PA","Boston, MA","Atlanta, GA"],
    temp: "32°F", equipment: "FTL Reefer",
    notes: "High respiration — pre-cooling and top-ice critical. CA/AZ season mirrors lettuce exactly. One of the most consistent FTL reefer commodities year-round. Salinas shippers often have both broccoli and lettuce — good full-truck mix opportunities." },
  { name: "Cauliflower", emoji: "🥦", category: "Brassicas", peakMonths: [0,1,2,3,4,9,10,11],
    origins: ["Salinas, CA","Santa Maria, CA","Lompoc, CA","Yuma, AZ"],
    destinations: ["Chicago, IL","New York, NY","Philadelphia, PA","Boston, MA","Dallas, TX","Los Angeles, CA"],
    temp: "32°F", equipment: "FTL Reefer",
    notes: "Demand surge from low-carb diets (cauliflower rice, pizza crust) has significantly increased FTL volumes over the past 5 years. CA Santa Cruz/Santa Barbara coast dominates. Same origin region and temperature as broccoli — very compatible co-shipper." },
  { name: "Cabbage", emoji: "🥬", category: "Brassicas", peakMonths: [0,1,2,3,4,5,9,10,11],
    origins: ["Salinas, CA","Yuma, AZ","Hastings, FL","Rocky Mount, NC"],
    destinations: ["Chicago, IL","New York, NY","Dallas, TX","Philadelphia, PA","Atlanta, GA","Miami, FL"],
    temp: "32°F", equipment: "FTL Reefer",
    notes: "High-cube, lower $/lb — efficient to fill a truck. FL leads East Coast Jan–Apr (Hastings is the hub). St. Patrick's Day demand spike in March is real and predictable — position accordingly. Hardy commodity, forgiving on transit." },
  { name: "Brussels Sprouts", emoji: "🥦", category: "Brassicas", peakMonths: [8,9,10,11,0,1],
    origins: ["Santa Maria, CA","Salinas, CA","Lompoc, CA"],
    destinations: ["Chicago, IL","New York, NY","Boston, MA","Philadelphia, PA","Dallas, TX","Atlanta, GA"],
    temp: "32°F", equipment: "FTL Reefer",
    notes: "CA produces 90%+ of US supply — Santa Cruz/Santa Barbara coast. Thanksgiving creates a massive Oct–Nov volume spike. On-stalk packaging increasingly popular and adds cube. CA→East lanes are long and high-value in Oct–Nov." },

  // ─── VEGETABLES ──────────────────────────────────────────────────────────────
  { name: "Tomatoes", emoji: "🍅", category: "Vegetables", peakMonths: [2,3,4,5,6,7,8,9],
    origins: ["Immokalee, FL","Nogales, AZ","Oxnard, CA","Homestead, FL"],
    destinations: ["New York, NY","Chicago, IL","Dallas, TX","Atlanta, GA","Philadelphia, PA","Houston, TX","Miami, FL"],
    temp: "55–70°F", equipment: "FTL Reefer",
    notes: "FL dominates Oct–Jun; CA takes summer; Nogales handles Mexican year-round imports. Never below 50°F — chilling ruins texture and flavor. High volume makes this a core broker commodity. Nogales→Dallas→Chicago is one of the busiest produce corridors in the US." },
  { name: "Bell Peppers", emoji: "🫑", category: "Vegetables", peakMonths: [2,3,4,5,6,7,8,9],
    origins: ["Nogales, AZ","Immokalee, FL","Laredo, TX","Brawley, CA"],
    destinations: ["Chicago, IL","New York, NY","Dallas, TX","Philadelphia, PA","Atlanta, GA","Boston, MA"],
    temp: "45–50°F", equipment: "FTL Reefer",
    notes: "Mexico via Nogales is increasingly dominant — monitor border capacity closely. FL leads domestic spring; CA takes summer. Red/yellow/orange bells move at 2x premium vs green, worth noting for shipper conversations. Do not go below 45°F." },
  { name: "Cucumbers", emoji: "🥒", category: "Vegetables", peakMonths: [2,3,4,5,6,7,8,9],
    origins: ["Nogales, AZ","Immokalee, FL","Laredo, TX","Palmetto, FL"],
    destinations: ["Chicago, IL","New York, NY","Dallas, TX","Philadelphia, PA","Atlanta, GA","Boston, MA"],
    temp: "50–55°F", equipment: "FTL Reefer",
    notes: "FL and Mexico (via Nogales and Laredo) are co-dominant year-round. Nogales handles the single largest volume of cucumber imports. High-volume, consistent reefer commodity. Chilling-sensitive — keep above 50°F." },
  { name: "Asparagus", emoji: "🌿", category: "Vegetables", peakMonths: [1,2,3,4,5],
    origins: ["Stockton, CA","Yakima, WA","Nogales, AZ","Pasco, WA"],
    destinations: ["Chicago, IL","New York, NY","Boston, MA","Philadelphia, PA","Seattle, WA","Dallas, TX"],
    temp: "32–36°F", equipment: "FTL Reefer",
    notes: "Extremely perishable — 2–3 day shelf life max in poor conditions. CA leads domestic Mar–May; WA follows. Upright hydro-cooled packs are standard premium product. Mexican imports via Nogales fill the Oct–Feb gap. Short window, high urgency, good rates." },
  { name: "Sweet Corn", emoji: "🌽", category: "Vegetables", peakMonths: [4,5,6,7,8],
    origins: ["Belle Glade, FL","Sacramento Valley, CA","Zellwood, FL","Rochelle, IL"],
    destinations: ["Chicago, IL","New York, NY","Philadelphia, PA","Boston, MA","Minneapolis, MN","Atlanta, GA"],
    temp: "32°F", equipment: "FTL Reefer",
    notes: "One of the most time-sensitive commodities — sugar converts to starch rapidly above 32°F, shelf life drops to days. FL opens May; Midwest peaks Jul–Aug. Loads often call for iced packaging plus refrigeration. Good summer lane for Midwest-based brokers." },
  { name: "Green Beans", emoji: "🫘", category: "Vegetables", peakMonths: [2,3,4,5,6,7,8,9],
    origins: ["Immokalee, FL","Nogales, AZ","Fresno, CA","Wauchula, FL","Laredo, TX"],
    destinations: ["Chicago, IL","New York, NY","Dallas, TX","Philadelphia, PA","Atlanta, GA","Boston, MA"],
    temp: "40–45°F", equipment: "FTL Reefer",
    notes: "High-volume with multiple harvests per season — consistent FTL demand. FL leads Dec–Apr; CA takes summer; Mexico year-round. Strong institutional demand (foodservice, schools, hospitals) keeps volume steady. Good lane to anchor FL winter reefer relationships." },
  { name: "Celery", emoji: "🥬", category: "Vegetables", peakMonths: [0,1,2,3,4,5,6,7,8,9,10,11],
    origins: ["Oxnard, CA","Salinas, CA","Sarasota County, FL","Lake Wales, FL"],
    destinations: ["Chicago, IL","New York, NY","Dallas, TX","Philadelphia, PA","Boston, MA","Atlanta, GA"],
    temp: "32°F", equipment: "FTL Reefer",
    notes: "Year-round commodity with steady, predictable FTL volume. CA handles Apr–Nov; FL takes winter. One of the best lanes for maintaining consistent carrier relationships — no dramatic season swings. Thanksgiving spikes demand significantly Oct–Nov." },
  { name: "Zucchini / Summer Squash", emoji: "🫑", category: "Vegetables", peakMonths: [2,3,4,5,6,7,8,9],
    origins: ["Nogales, AZ","Immokalee, FL","Fresno, CA","Laredo, TX"],
    destinations: ["Chicago, IL","New York, NY","Dallas, TX","Philadelphia, PA","Atlanta, GA","Los Angeles, CA"],
    temp: "41–50°F", equipment: "FTL Reefer",
    notes: "High-cube, moderate value — efficient reefer load. FL and Mexico dominate spring; CA takes summer. Mexico year-round via Nogales. Compatible temps with cucumbers and bell peppers — good mixed-load opportunity for smaller shippers." },

  // ─── ROOT VEGETABLES ─────────────────────────────────────────────────────────
  { name: "Potatoes", emoji: "🥔", category: "Root Vegetables", peakMonths: [0,1,2,3,7,8,9,10,11],
    origins: ["Idaho Falls, ID","Yakima, WA","Greeley, CO","Red River Valley, ND","Aroostook County, ME","Twin Falls, ID","Buhl, ID"],
    destinations: ["Chicago, IL","Los Angeles, CA","New York, NY","Dallas, TX","Atlanta, GA","Denver, CO","Philadelphia, PA"],
    temp: "40–50°F", equipment: "FTL Reefer / FTL Dry Van",
    notes: "One of the largest OTR produce lanes in the country by volume. Idaho ships 30%+ of US supply year-round from cold storage. Harvest Jul–Oct creates a secondary fresh volume spike. ID/WA→Midwest and →East are consistent, high-volume freight lanes. Dry van viable in cooler months — verify ambient temps." },
  { name: "Sweet Potatoes", emoji: "🍠", category: "Root Vegetables", peakMonths: [0,1,2,9,10,11],
    origins: ["Faison, NC","Chadbourn, NC","Vardaman, MS","Tifton, GA","Goldsboro, NC"],
    destinations: ["Chicago, IL","New York, NY","Philadelphia, PA","Boston, MA","Los Angeles, CA","Atlanta, GA"],
    temp: "55–60°F", equipment: "FTL Dry Van / Temp-Controlled",
    notes: "NC produces 60%+ of US supply. Harvest Sep–Nov; ships Oct–Apr from cold storage. CRITICAL for carriers: never below 55°F — hard core chilling injury is irreversible and not visible at delivery. Dry van is standard but must avoid freezing temps in winter. Strong NC→Northeast corridor." },
  { name: "Carrots", emoji: "🥕", category: "Root Vegetables", peakMonths: [0,1,2,3,4,5,6,7,8,9,10,11],
    origins: ["Bakersfield, CA","Holtville, CA","Firebaugh, CA"],
    destinations: ["Chicago, IL","New York, NY","Dallas, TX","Atlanta, GA","Philadelphia, PA","Boston, MA"],
    temp: "32°F", equipment: "FTL Reefer",
    notes: "CA produces 85%+ of US carrots year-round — Bakersfield/Kern County is the national hub. One of the most consistent reefer lanes in produce. Baby carrots (value-added, higher $/lb) ship in the same corridor. Year-round, predictable volume — excellent for building long-term carrier relationships out of CA." },
  { name: "Onions", emoji: "🧅", category: "Root Vegetables", peakMonths: [4,5,6,7,8,9,10,11],
    origins: ["Nyssa, OR","Nampa, ID","Vidalia, GA","Rio Grande Valley, TX","Walla Walla, WA","Center, CO"],
    destinations: ["Chicago, IL","New York, NY","Dallas, TX","Los Angeles, CA","Miami, FL","Houston, TX","Atlanta, GA"],
    temp: "32–40°F", equipment: "FTL Reefer / FTL Dry Van",
    notes: "Idaho-Oregon region is the largest domestic source. Vidalia sweet onions peak Apr–Jun — premium product, premium lanes. CO San Luis Valley ships Aug–Oct. Hardy commodity — dry van viable in cooler months. High volume makes this a solid lane anchor for Pacific NW and CO-based brokers." },

  // ─── SPECIALTY / SEASONAL ────────────────────────────────────────────────────
  { name: "Garlic", emoji: "🧄", category: "Specialty", peakMonths: [5,6,7,8,9,10,11],
    origins: ["Gilroy, CA","San Joaquin Valley, CA","Nampa, ID"],
    destinations: ["Chicago, IL","New York, NY","Los Angeles, CA","Dallas, TX","Miami, FL","Houston, TX"],
    temp: "32°F", equipment: "FTL Dry Van / FTL Reefer",
    notes: "Gilroy CA is the national hub — harvest Jun–Jul, ships from cold storage through winter. CA produces 80%+ of domestic supply. Dry van is preferred for cured product; reefer for fresh. Garlic is dense — max weight loads common. Good lane for filling CA outbound in summer." },
  { name: "Pumpkins", emoji: "🎃", category: "Specialty", peakMonths: [8,9,10],
    origins: ["Morton, IL","Rocky Ford, CO","Lyons, OR","Kewaunee, WI"],
    destinations: ["Chicago, IL","New York, NY","Boston, MA","Dallas, TX","Minneapolis, MN","Kansas City, MO"],
    temp: "50–55°F", equipment: "FTL Dry Van / Flatbed",
    notes: "Compressed Sep–Oct window, high cube, lower value — flatbeds and dry vans dominate. Morton IL (Libby's processing hub) drives enormous canned pumpkin volume. Fresh market pumpkins to retail spike in September. Plan lanes by mid-August or miss the window." },
  { name: "Butternut Squash", emoji: "🧡", category: "Specialty", peakMonths: [7,8,9,10,11],
    origins: ["Olathe, CO","Center, CO","Salinas, CA","Klamath Falls, OR"],
    destinations: ["Chicago, IL","New York, NY","Philadelphia, PA","Boston, MA","Dallas, TX","Denver, CO"],
    temp: "50–60°F", equipment: "FTL Dry Van / Temp-Controlled",
    notes: "CO San Luis Valley is premium — Olathe ships Aug–Nov. CA takes summer. Do not refrigerate below 50°F. Dry van viable when ambient temps allow. Dense product — weight-out loads common. Good fall lane for CO and OR-based brokers." },
];

const CATEGORIES = [...new Set(PRODUCE.map(p => p.category))].sort();

export default function ProduceHeatMap() {
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [statePaths, setStatePaths] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredOrigin, setHoveredOrigin] = useState(null);
  const [selectedProduce, setSelectedProduce] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const [filterCategory, setFilterCategory] = useState("All");
  const [sidebarSearch, setSidebarSearch] = useState("");
  const [sidebarTab, setSidebarTab] = useState("commodities"); // "commodities" | "od"
  const [odOrigin, setOdOrigin] = useState(null);
  const [odDest, setOdDest] = useState(null);
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const [zoomTransform, setZoomTransform] = useState({ k: 1, x: 0, y: 0 });
  const zoomBehaviorRef = useRef(null);
  const [dims, setDims] = useState({ w: 960, h: 600 });

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        const w = Math.max(containerRef.current.offsetWidth, 400);
        setDims({ w, h: Math.round(w * 0.625) });
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!window.topojson) {
        await new Promise((res) => {
          const s = document.createElement("script");
          s.src = "https://cdnjs.cloudflare.com/ajax/libs/topojson/3.0.2/topojson.min.js";
          s.onload = res; document.head.appendChild(s);
        });
      }
      const resp = await fetch("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json");
      const topo = await resp.json();
      const features = window.topojson.feature(topo, topo.objects.states).features;
      const mesh = window.topojson.mesh(topo, topo.objects.states, (a, b) => a !== b);
      setStatePaths({ features, mesh });
      setLoading(false);
    };
    load().catch(() => setLoading(false));
  }, []);

  // Wire up D3 zoom after map loads and SVG is in DOM
  useEffect(() => {
    if (loading || !svgRef.current) return;
    const zoom = d3.zoom()
      .scaleExtent([1, 12])
      .on("zoom", (e) => {
        setZoomTransform({ k: e.transform.k, x: e.transform.x, y: e.transform.y });
      });
    zoomBehaviorRef.current = zoom;
    d3.select(svgRef.current).call(zoom);
    return () => d3.select(svgRef.current).on(".zoom", null);
  }, [loading]);

  const proj = useMemo(() => d3.geoAlbersUsa().scale(dims.w * 1.28).translate([dims.w / 2, dims.h / 2]), [dims]);
  const pathGen = useMemo(() => d3.geoPath().projection(proj), [proj]);
  const projectPoint = (coords) => proj(coords);

  const handleZoomIn = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current).transition().duration(300).call(zoomBehaviorRef.current.scaleBy, 1.6);
  };
  const handleZoomOut = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current).transition().duration(300).call(zoomBehaviorRef.current.scaleBy, 0.625);
  };
  const handleZoomReset = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current).transition().duration(400).call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
  };

  const activeProduce = useMemo(() => {
    return PRODUCE.filter(p => {
      const monthMatch = p.peakMonths.includes(selectedMonth);
      const catMatch = filterCategory === "All" || p.category === filterCategory;
      const searchMatch = sidebarSearch === "" || p.name.toLowerCase().includes(sidebarSearch.toLowerCase());
      return monthMatch && catMatch && searchMatch;
    });
  }, [selectedMonth, filterCategory, sidebarSearch]);

  const originActivity = useMemo(() => {
    const map = {};
    activeProduce.forEach(p => {
      p.origins.forEach(o => {
        if (!ORIGIN_COORDS[o]) return;
        if (!map[o]) map[o] = { name: o, count: 0, commodities: [] };
        map[o].count++;
        map[o].commodities.push(p.name);
      });
    });
    return Object.values(map);
  }, [activeProduce]);

  const selectedData = selectedProduce ? PRODUCE.find(p => p.name === selectedProduce) : null;

  // O/D mode: all origins active this month
  const odOriginList = useMemo(() => {
    const set = new Set();
    activeProduce.forEach(p => p.origins.forEach(o => { if (ORIGIN_COORDS[o]) set.add(o); }));
    return [...set].sort();
  }, [activeProduce]);

  // Destinations reachable from selected O/D origin this month
  const odDestList = useMemo(() => {
    if (!odOrigin) return [];
    const set = new Set();
    activeProduce.forEach(p => {
      if (p.origins.includes(odOrigin)) p.destinations.forEach(d => { if (DEST_COORDS[d]) set.add(d); });
    });
    return [...set].sort();
  }, [odOrigin, activeProduce]);

  // Commodities on the selected O→D lane
  const odLaneCommodities = useMemo(() => {
    if (!odOrigin) return [];
    return activeProduce.filter(p => {
      const hasOrigin = p.origins.includes(odOrigin);
      const hasDest = odDest ? p.destinations.includes(odDest) : true;
      return hasOrigin && hasDest;
    });
  }, [odOrigin, odDest, activeProduce]);

  // Map highlight logic for O/D mode
  const odMapOrigins = odOrigin ? [odOrigin] : [];
  const odMapDests = odDest ? [odDest] : (odOrigin ? odDestList : []);

  const heatColor = (count) => {
    if (count >= 7) return "#ffffff";
    if (count >= 5) return "#88ddff";
    if (count >= 3) return "#00aaff";
    if (count >= 2) return "#0088ff";
    return "#0055ff";
  };
  const heatRadius = (count) => {
    if (count >= 7) return 64;
    if (count >= 5) return 52;
    if (count >= 3) return 40;
    if (count >= 2) return 30;
    return 20;
  };

  return (
    <div style={{ fontFamily: "'Courier New', monospace", background: "#06090f", minHeight: "100vh", color: "#b0c8ee", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "14px 20px 10px", borderBottom: "1px solid #0f1828", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <div>
          <div style={{ fontSize: 13, letterSpacing: "0.3em", color: "#2a4a7a", textTransform: "uppercase", marginBottom: 2 }}>Resolve Logistics · Internal Tool</div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: "0.06em", color: "#d0e4f8" }}>US Produce Shipping Heat Map</h1>
        </div>
        <div style={{ display: "flex", gap: 14, fontSize: 14, color: "#3a5a9a", flexWrap: "wrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#00aaff", display: "inline-block", boxShadow: "0 0 7px #00aaff" }}></span> Origin
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#00d4ff", display: "inline-block", boxShadow: "0 0 5px #00d4ff" }}></span> Destination
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 12, height: 2, background: "#3388ff", display: "inline-block", opacity: 0.8 }}></span> Lane
          </span>
        </div>
      </div>

      {/* Month bar */}
      <div style={{ padding: "10px 20px", borderBottom: "1px solid #0f1828", display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: 13, color: "#2a4a7a", letterSpacing: "0.2em", marginRight: 6, textTransform: "uppercase" }}>Month:</span>
        {MONTHS.map((m, i) => {
          const isSelected = i === selectedMonth;
          const isCurrent = i === currentMonth;
          const cnt = PRODUCE.filter(p => p.peakMonths.includes(i)).length;
          return (
            <button key={m} onClick={() => { setSelectedMonth(i); setSelectedProduce(null); }}
              style={{
                padding: "5px 10px", borderRadius: 3,
                background: isSelected ? "#1e3a70" : "#080c18",
                color: isSelected ? "#d0e4f8" : "#3a5a9a",
                border: isSelected ? "1px solid #4a7acc" : isCurrent ? "1px solid #1e3a70" : "1px solid #0f1828",
                fontSize: 13, cursor: "pointer", fontFamily: "monospace", fontWeight: isSelected ? 700 : 400,
                letterSpacing: "0.04em", transition: "all 0.12s",
              }}>
              {m}{isCurrent && <span style={{ color: "#00aaff", marginLeft: 2, fontSize: 8 }}>●</span>}
            </button>
          );
        })}
        <span style={{ marginLeft: "auto", fontSize: 14, color: "#2a4a7a" }}>{activeProduce.length} commodities active</span>
      </div>

      {/* Category filter */}
      <div style={{ padding: "8px 20px", borderBottom: "1px solid #0f1828", display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: 13, color: "#2a4a7a", letterSpacing: "0.2em", marginRight: 6, textTransform: "uppercase" }}>Filter:</span>
        {["All", ...CATEGORIES].map(cat => (
          <button key={cat} onClick={() => setFilterCategory(cat)}
            style={{
              padding: "3px 10px", borderRadius: 3,
              background: filterCategory === cat ? "#0e2650" : "transparent",
              color: filterCategory === cat ? "#7ab0e8" : "#2a4a7a",
              border: filterCategory === cat ? "1px solid #1a5aaa" : "1px solid #0f1828",
              fontSize: 14, cursor: "pointer", fontFamily: "monospace",
            }}>{cat}</button>
        ))}
      </div>

      <div style={{ display: "flex", flex: 1 }}>
        {/* Map */}
        <div ref={containerRef} style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          {loading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 500, color: "#2a4a7a", fontSize: 13, letterSpacing: "0.25em" }}>
              LOADING MAP…
            </div>
          ) : (
            <svg ref={svgRef} width="100%" viewBox={`0 0 ${dims.w} ${dims.h}`} style={{ display: "block", cursor: zoomTransform.k > 1 ? "grab" : "default" }}>
              <defs>
                <filter id="heatGlow" x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur stdDeviation="16" />
                </filter>
                <filter id="dotGlow" x="-150%" y="-150%" width="400%" height="400%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
                <filter id="destGlow" x="-150%" y="-150%" width="400%" height="400%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
                <filter id="lineGlow">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>
              <rect width={dims.w} height={dims.h} fill="#06090f" />
              <g transform={`translate(${zoomTransform.x},${zoomTransform.y}) scale(${zoomTransform.k})`}>
              {statePaths?.features?.map(f => (
                <path key={f.id} d={pathGen(f)} fill="#0a0e1a" stroke="none" />
              ))}
              {statePaths?.mesh && (
                <path d={pathGen(statePaths.mesh)} fill="none" stroke="#142038" strokeWidth={0.6} />
              )}
              {/* Heat blobs */}
              {originActivity.map(o => {
                const coords = ORIGIN_COORDS[o.name];
                if (!coords) return null;
                const pt = projectPoint(coords);
                if (!pt) return null;
                const isHighlighted = odOrigin === o.name ||
                  (sidebarTab === "commodities" && selectedData?.origins.includes(o.name));
                const isDimmed = (odOrigin && odOrigin !== o.name) ||
                  (sidebarTab === "commodities" && selectedData && !selectedData.origins.includes(o.name));
                return (
                  <circle key={`heat-${o.name}`} cx={pt[0]} cy={pt[1]}
                    r={heatRadius(o.count)}
                    fill={isHighlighted ? "#00eeff" : heatColor(o.count)}
                    opacity={isDimmed ? 0.05 : isHighlighted ? 0.6 : 0.28}
                    filter="url(#heatGlow)"
                    style={{ pointerEvents: "none" }}
                  />
                );
              })}
              {/* Lane lines — commodity mode */}
              {sidebarTab === "commodities" && selectedData && selectedData.origins.map(o => {
                const oCoords = ORIGIN_COORDS[o];
                if (!oCoords) return null;
                const oPt = projectPoint(oCoords);
                if (!oPt) return null;
                return selectedData.destinations.map(d => {
                  const dCoords = DEST_COORDS[d];
                  if (!dCoords) return null;
                  const dPt = projectPoint(dCoords);
                  if (!dPt) return null;
                  const mx = (oPt[0] + dPt[0]) / 2;
                  const my = Math.min(oPt[1], dPt[1]) - 50;
                  return (
                    <path key={`${o}-${d}`}
                      d={`M ${oPt[0]} ${oPt[1]} Q ${mx} ${my} ${dPt[0]} ${dPt[1]}`}
                      fill="none" stroke="#3388ff" strokeWidth={0.9} opacity={0.3}
                      filter="url(#lineGlow)" style={{ pointerEvents: "none" }}
                    />
                  );
                });
              })}
              {/* Lane lines — O/D mode */}
              {sidebarTab === "od" && odOrigin && odMapDests.map(d => {
                const oCoords = ORIGIN_COORDS[odOrigin];
                const dCoords = DEST_COORDS[d];
                if (!oCoords || !dCoords) return null;
                const oPt = projectPoint(oCoords);
                const dPt = projectPoint(dCoords);
                if (!oPt || !dPt) return null;
                const isSelectedLane = odDest === d;
                const mx = (oPt[0] + dPt[0]) / 2;
                const my = Math.min(oPt[1], dPt[1]) - 50;
                return (
                  <path key={`od-${odOrigin}-${d}`}
                    d={`M ${oPt[0]} ${oPt[1]} Q ${mx} ${my} ${dPt[0]} ${dPt[1]}`}
                    fill="none"
                    stroke={isSelectedLane ? "#00ddff" : "#3388ff"}
                    strokeWidth={isSelectedLane ? 1.4 : 0.8}
                    opacity={isSelectedLane ? 0.6 : (odDest ? 0.12 : 0.28)}
                    filter="url(#lineGlow)" style={{ pointerEvents: "none" }}
                  />
                );
              })}
              {/* Destination dots — commodity mode */}
              {sidebarTab === "commodities" && selectedData && selectedData.destinations.map(d => {
                const coords = DEST_COORDS[d];
                if (!coords) return null;
                const pt = projectPoint(coords);
                if (!pt) return null;
                return (
                  <g key={`dest-${d}`}>
                    <circle cx={pt[0]} cy={pt[1]} r={10} fill="#00d4ff" opacity={0.12} style={{ pointerEvents: "none" }} />
                    <circle cx={pt[0]} cy={pt[1]} r={4} fill="#00d4ff" filter="url(#destGlow)" style={{ pointerEvents: "none" }} />
                    <text x={pt[0]} y={pt[1] - 10} textAnchor="middle" fontSize={9} fill="#00d4ff" opacity={0.7} style={{ pointerEvents: "none", fontFamily: "monospace" }}>
                      {d.split(",")[0]}
                    </text>
                  </g>
                );
              })}
              {/* Destination dots — O/D mode */}
              {sidebarTab === "od" && odOrigin && odMapDests.map(d => {
                const coords = DEST_COORDS[d];
                if (!coords) return null;
                const pt = projectPoint(coords);
                if (!pt) return null;
                const isSelectedDest = odDest === d;
                return (
                  <g key={`oddest-${d}`} onClick={() => setOdDest(isSelectedDest ? null : d)} style={{ cursor: "pointer" }}>
                    <circle cx={pt[0]} cy={pt[1]} r={14} fill={isSelectedDest ? "#00ddff" : "#00d4ff"} opacity={0.08} />
                    <circle cx={pt[0]} cy={pt[1]} r={isSelectedDest ? 6 : 4}
                      fill={isSelectedDest ? "#00ddff" : "#00d4ff"}
                      filter="url(#destGlow)"
                      stroke={isSelectedDest ? "#fff" : "none"} strokeWidth={1}
                    />
                    <text x={pt[0]} y={pt[1] - 11} textAnchor="middle" fontSize={9}
                      fill={isSelectedDest ? "#00ddff" : "#00d4ff"}
                      opacity={isSelectedDest ? 1 : 0.65}
                      style={{ pointerEvents: "none", fontFamily: "monospace", fontWeight: isSelectedDest ? "bold" : "normal" }}>
                      {d.split(",")[0]}
                    </text>
                  </g>
                );
              })}
              {/* Origin dots */}
              {originActivity.map(o => {
                const coords = ORIGIN_COORDS[o.name];
                if (!coords) return null;
                const pt = projectPoint(coords);
                if (!pt) return null;
                const isHovered = hoveredOrigin === o.name;
                const isHighlighted = odOrigin === o.name ||
                  (sidebarTab === "commodities" && selectedData?.origins.includes(o.name));
                const isDimmed = (odOrigin && odOrigin !== o.name) ||
                  (sidebarTab === "commodities" && selectedData && !selectedData.origins.includes(o.name));
                return (
                  <g key={`dot-${o.name}`}
                    onMouseEnter={(e) => { setHoveredOrigin(o.name); setTooltip({ x: e.clientX, y: e.clientY, data: o }); }}
                    onMouseLeave={() => { setHoveredOrigin(null); setTooltip(null); }}
                    onClick={() => {
                      setSidebarTab("od");
                      setOdOrigin(odOrigin === o.name ? null : o.name);
                      setOdDest(null);
                      setSelectedProduce(null);
                    }}
                    style={{ cursor: "pointer" }}>
                    {isHovered && <circle cx={pt[0]} cy={pt[1]} r={16} fill={heatColor(o.count)} opacity={0.18} />}
                    <circle cx={pt[0]} cy={pt[1]} r={isHovered || isHighlighted ? 6 : 4}
                      fill={isHighlighted ? "#00eeff" : isDimmed ? "#101828" : heatColor(o.count)}
                      filter="url(#dotGlow)" opacity={isDimmed ? 0.25 : 1}
                      stroke={isHovered || isHighlighted ? "#fff" : "none"} strokeWidth={1}
                    />
                  </g>
                );
              })}
              </g>{/* end zoom group */}
            </svg>
          )}

          {/* Zoom controls */}
          {!loading && (
            <div style={{ position: "absolute", bottom: 16, left: 16, display: "flex", flexDirection: "column", gap: 4 }}>
              {[["＋", handleZoomIn], ["－", handleZoomOut], ["⊙", handleZoomReset]].map(([label, fn]) => (
                <button key={label} onClick={fn} style={{
                  width: 34, height: 34, background: "#0a1428", border: "1px solid #182840",
                  color: "#7ab0e8", fontSize: 22, cursor: "pointer", borderRadius: 4,
                  fontFamily: "monospace", display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.12s",
                }}>{label}</button>
              ))}
              <div style={{ textAlign: "center", fontSize: 14, color: "#2a4a7a", marginTop: 2, letterSpacing: "0.05em" }}>
                {Math.round(zoomTransform.k * 100)}%
              </div>
            </div>
          )}

          {/* Tooltip */}
          {tooltip && (
            <div style={{
              position: "fixed", left: tooltip.x + 14, top: tooltip.y - 8,
              background: "#080c18", border: "1px solid #182e58",
              padding: "10px 14px", borderRadius: 4, fontSize: 13,
              pointerEvents: "none", zIndex: 999, maxWidth: 240,
              boxShadow: "0 4px 24px #000c",
            }}>
              <div style={{ fontWeight: 700, color: "#d0e4f8", marginBottom: 5, fontSize: 12 }}>{tooltip.data.name}</div>
              <div style={{ color: "#4a8acc", marginBottom: 5 }}>{tooltip.data.count} active {tooltip.data.count === 1 ? "commodity" : "commodities"}</div>
              <div style={{ color: "#7090c0", lineHeight: 1.7, fontSize: 10 }}>{tooltip.data.commodities.join(" · ")}</div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ width: 280, borderLeft: "1px solid #0f1828", background: "#06090f", flexShrink: 0, display: "flex", flexDirection: "column" }}>
          {/* Tab bar */}
          <div style={{ display: "flex", borderBottom: "1px solid #0f1828" }}>
            {[["commodities","🌽 Commodities"],["od","🔀 O/D Pairs"]].map(([tab, label]) => (
              <button key={tab} onClick={() => { setSidebarTab(tab); setSelectedProduce(null); setOdOrigin(null); setOdDest(null); }}
                style={{
                  flex: 1, padding: "9px 4px",
                  background: sidebarTab === tab ? "#0a1428" : "transparent",
                  color: sidebarTab === tab ? "#7ab0e8" : "#2a4a7a",
                  border: "none",
                  borderBottom: sidebarTab === tab ? "2px solid #3a6acc" : "2px solid transparent",
                  fontSize: 14, cursor: "pointer", fontFamily: "monospace",
                  letterSpacing: "0.05em", fontWeight: sidebarTab === tab ? 700 : 400,
                }}>
                {label}
              </button>
            ))}
          </div>

          {/* COMMODITIES TAB */}
          {sidebarTab === "commodities" && (
            <>
              <div style={{ padding: "10px 12px 6px", borderBottom: "1px solid #0f1828" }}>
                <div style={{ fontSize: 13, letterSpacing: "0.2em", color: "#2a4a7a", textTransform: "uppercase", marginBottom: 6 }}>
                  {MONTHS[selectedMonth]} · {activeProduce.length} Active
                </div>
                <input placeholder="Search…" value={sidebarSearch} onChange={e => setSidebarSearch(e.target.value)}
                  style={{ width: "100%", padding: "5px 8px", background: "#080c18", border: "1px solid #182840", borderRadius: 3, color: "#7a9abe", fontSize: 13, fontFamily: "monospace", outline: "none", boxSizing: "border-box" }}
                />
              </div>
              <div style={{ padding: "8px", flex: 1, overflowY: "auto" }}>
                {activeProduce.length === 0 && <div style={{ color: "#182e58", fontSize: 13, textAlign: "center", paddingTop: 24 }}>No results</div>}
                {activeProduce.map(p => {
                  const isSelected = selectedProduce === p.name;
                  return (
                    <div key={p.name} onClick={() => setSelectedProduce(isSelected ? null : p.name)}
                      style={{ padding: "8px 10px", marginBottom: 4, background: isSelected ? "#0d1e40" : "#0a0e1a", border: `1px solid ${isSelected ? "#2a5a9a" : "#0e1830"}`, borderRadius: 4, cursor: "pointer", transition: "all 0.12s" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <span style={{ fontSize: 16 }}>{p.emoji}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: isSelected ? 700 : 500, color: isSelected ? "#90c8f0" : "#6090c8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                          <div style={{ fontSize: 13, color: "#1e3a70", marginTop: 1 }}>{p.category} · {p.equipment}</div>
                        </div>
                      </div>
                      {isSelected && (
                        <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #182840" }}>
                          <div style={{ fontSize: 13, color: "#1a4890", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>Origins</div>
                          {p.origins.map(o => <div key={o} style={{ fontSize: 13, color: "#55bbff", marginBottom: 2, paddingLeft: 5, borderLeft: "2px solid #0055ff" }}>{o}</div>)}
                          <div style={{ fontSize: 13, color: "#1a4890", letterSpacing: "0.12em", textTransform: "uppercase", margin: "7px 0 4px" }}>Destinations</div>
                          {p.destinations.slice(0,5).map(d => <div key={d} style={{ fontSize: 13, color: "#44ccff", marginBottom: 2, paddingLeft: 5, borderLeft: "2px solid #0077aa" }}>{d}</div>)}
                          <div style={{ fontSize: 13, color: "#2a4a7a", marginTop: 7 }}>🌡️ {p.temp}</div>
                          <div style={{ fontSize: 13, color: "#3a6a9a", marginTop: 6, lineHeight: 1.55, fontStyle: "italic" }}>{p.notes}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* O/D PAIRS TAB */}
          {sidebarTab === "od" && (
            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
              {/* Step 1 — Origin */}
              <div style={{ padding: "10px 12px", borderBottom: "1px solid #0f1828" }}>
                <div style={{ fontSize: 13, letterSpacing: "0.2em", color: "#2a4a7a", textTransform: "uppercase", marginBottom: 8 }}>
                  Step 1 · Select Origin
                </div>
                <div style={{ fontSize: 13, color: "#1e3a70", marginBottom: 8, fontStyle: "italic" }}>
                  Click a dot on the map or choose below
                </div>
                <select
                  value={odOrigin || ""}
                  onChange={e => { setOdOrigin(e.target.value || null); setOdDest(null); }}
                  style={{ width: "100%", padding: "5px 8px", background: "#080c18", border: "1px solid #182840", borderRadius: 3, color: odOrigin ? "#55bbff" : "#2a4a7a", fontSize: 14, fontFamily: "monospace", outline: "none", boxSizing: "border-box" }}>
                  <option value="">— All Origins —</option>
                  {odOriginList.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              {/* Step 2 — Destination (only if origin selected) */}
              {odOrigin && (
                <div style={{ padding: "10px 12px", borderBottom: "1px solid #0f1828" }}>
                  <div style={{ fontSize: 13, letterSpacing: "0.2em", color: "#2a4a7a", textTransform: "uppercase", marginBottom: 8 }}>
                    Step 2 · Select Destination
                  </div>
                  <div style={{ fontSize: 13, color: "#1e3a70", marginBottom: 8, fontStyle: "italic" }}>
                    Click a destination on map or choose below
                  </div>
                  <select
                    value={odDest || ""}
                    onChange={e => setOdDest(e.target.value || null)}
                    style={{ width: "100%", padding: "5px 8px", background: "#080c18", border: "1px solid #182840", borderRadius: 3, color: odDest ? "#00d4ff" : "#2a4a7a", fontSize: 14, fontFamily: "monospace", outline: "none", boxSizing: "border-box" }}>
                    <option value="">— All Destinations ({odDestList.length}) —</option>
                    {odDestList.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              )}

              {/* Results */}
              <div style={{ padding: "10px 12px", flex: 1, overflowY: "auto" }}>
                {!odOrigin && (
                  <div style={{ color: "#182e58", fontSize: 13, textAlign: "center", paddingTop: 30, lineHeight: 1.8 }}>
                    Select an origin region<br/>to see its lanes and<br/>active commodities.
                  </div>
                )}
                {odOrigin && (
                  <>
                    {/* Lane summary header */}
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 13, color: "#55bbff", fontWeight: 700, marginBottom: 3 }}>
                        📍 {odOrigin}
                      </div>
                      {odDest ? (
                        <div style={{ fontSize: 13, color: "#00d4ff", fontWeight: 700, marginBottom: 3 }}>
                          → 🏙️ {odDest}
                        </div>
                      ) : (
                        <div style={{ fontSize: 13, color: "#2a4a7a" }}>→ {odDestList.length} destinations · {odLaneCommodities.length} commodities</div>
                      )}
                    </div>

                    {/* Commodity cards on this lane */}
                    {odLaneCommodities.length === 0 && (
                      <div style={{ color: "#182e58", fontSize: 14, fontStyle: "italic" }}>No active commodities on this lane this month.</div>
                    )}
                    {odLaneCommodities.map(p => (
                      <div key={p.name} style={{ padding: "8px 10px", marginBottom: 6, background: "#0a0e1a", border: "1px solid #0e1830", borderRadius: 4 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                          <span style={{ fontSize: 15 }}>{p.emoji}</span>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "#90c8f0" }}>{p.name}</div>
                            <div style={{ fontSize: 13, color: "#1e3a70" }}>{p.category}</div>
                          </div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, marginBottom: 5 }}>
                          <div style={{ fontSize: 13, color: "#2a4a7a" }}>🌡️ {p.temp}</div>
                          <div style={{ fontSize: 13, color: "#2a4a7a" }}>🚛 {p.equipment}</div>
                        </div>
                        {/* Peak months mini bar */}
                        <div style={{ display: "flex", gap: 2, marginBottom: 5 }}>
                          {MONTHS.map((m, i) => (
                            <div key={m} style={{ flex: 1, height: 4, borderRadius: 1, background: p.peakMonths.includes(i) ? (i === selectedMonth ? "#4a8acc" : "#0e2650") : "#080c18" }} title={m} />
                          ))}
                        </div>
                        <div style={{ fontSize: 13, color: "#3a6a9a", lineHeight: 1.5, fontStyle: "italic" }}>{p.notes}</div>
                      </div>
                    ))}

                    {/* Other destinations from this origin (when no dest selected) */}
                    {!odDest && odDestList.length > 0 && (
                      <div style={{ marginTop: 10 }}>
                        <div style={{ fontSize: 13, letterSpacing: "0.15em", textTransform: "uppercase", color: "#1e3a70", marginBottom: 6 }}>All Destinations</div>
                        {odDestList.map(d => {
                          const cnt = activeProduce.filter(p => p.origins.includes(odOrigin) && p.destinations.includes(d)).length;
                          return (
                            <div key={d} onClick={() => setOdDest(d)}
                              style={{ padding: "6px 10px", marginBottom: 3, background: "#080c18", border: "1px solid #0f1828", borderRadius: 3, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontSize: 14, color: "#44ccff" }}>{d}</span>
                              <span style={{ fontSize: 13, color: "#1a4890", fontFamily: "monospace" }}>{cnt} crop{cnt !== 1 ? "s" : ""}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Clear button */}
              {(odOrigin || odDest) && (
                <div style={{ padding: "8px 12px", borderTop: "1px solid #0f1828" }}>
                  <button onClick={() => { setOdOrigin(null); setOdDest(null); }}
                    style={{ width: "100%", padding: "6px", background: "transparent", border: "1px solid #182e58", borderRadius: 3, color: "#2a4a7a", fontSize: 14, fontFamily: "monospace", cursor: "pointer", letterSpacing: "0.1em" }}>
                    ✕ CLEAR SELECTION
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div style={{ padding: "7px 20px", borderTop: "1px solid #0f1828", display: "flex", gap: 14, alignItems: "center", fontSize: 13, color: "#2a4a7a", letterSpacing: "0.1em", flexWrap: "wrap" }}>
        <span style={{ textTransform: "uppercase" }}>Origin Heat:</span>
        {[["#0055ff","1"],["#0088ff","2"],["#00aaff","3–4"],["#88ddff","5–6"],["#ffffff","7+"]].map(([color, label]) => (
          <span key={label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: color, display: "inline-block", boxShadow: `0 0 5px ${color}` }}></span>
            {label} crop{label !== "1" ? "s" : ""}
          </span>
        ))}
        <span style={{ marginLeft: "auto", color: "#182e58" }}>Resolve Logistics Internal · {PRODUCE.length} commodities · Click commodity to show lanes</span>
      </div>
    </div>
  );
}
