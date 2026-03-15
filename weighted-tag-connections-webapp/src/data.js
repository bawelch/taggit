export const ENTRY_DATA = [
  ["Mercury", { planet: 0.98, roman_god: 0.86, element: 0.72 }],
  ["Venus", { planet: 0.98, roman_god: 0.83 }],
  ["Earth", { planet: 0.99, nature: 0.65 }],
  ["Mars", { planet: 0.98, roman_god: 0.84 }],
  ["Jupiter", { planet: 0.97, roman_god: 0.81 }],
  ["Saturn", { planet: 0.97, roman_god: 0.80 }],

  ["Alpha", { greek_letter: 0.98, science: 0.35 }],
  ["Beta", { greek_letter: 0.98, finance: 0.28 }],
  ["Gamma", { greek_letter: 0.98, science: 0.40 }],
  ["Delta", { greek_letter: 0.98, geography: 0.32 }],
  ["Omega", { greek_letter: 0.96, finality: 0.41 }],

  ["Holmes", { detective: 0.99, british_fiction: 0.75 }],
  ["Poirot", { detective: 0.99, belgian: 0.64 }],
  ["Marple", { detective: 0.97, british_fiction: 0.79 }],
  ["Morse", { detective: 0.95, british_fiction: 0.76 }],
  ["Columbo", { detective: 0.96, tv_detective: 0.78 }],
  ["Spade", { detective: 0.90, noir: 0.72 }],

  ["Violin", { instrument: 0.96, wood: 0.22 }],
  ["Piano", { instrument: 0.97 }],
  ["Trumpet", { instrument: 0.95, brass: 0.63 }],
  ["Cello", { instrument: 0.94, wood: 0.35 }],
  ["Flute", { instrument: 0.93, woodwind: 0.66 }],

  ["Oak", { tree: 0.97, wood: 0.55 }],
  ["Pine", { tree: 0.97, evergreen: 0.67 }],
  ["Ash", { tree: 0.95, wood: 0.41 }],
  ["Birch", { tree: 0.95, pale: 0.34 }],
  ["Maple", { tree: 0.95, syrup: 0.80 }],

  ["Ruby", { gem: 0.97, red: 0.73 }],
  ["Sapphire", { gem: 0.97, blue: 0.76 }],
  ["Emerald", { gem: 0.97, green: 0.75 }],
  ["Topaz", { gem: 0.93, yellow: 0.61 }],
  ["Opal", { gem: 0.94, iridescent: 0.83 }],

  ["Paris", { capital: 0.97, europe: 0.71 }],
  ["Rome", { capital: 0.96, europe: 0.74 }],
  ["Madrid", { capital: 0.96, europe: 0.69 }],
  ["Dublin", { capital: 0.95, europe: 0.68 }],
  ["Athens", { capital: 0.96, europe: 0.73, greek: 0.52 }],

  ["Square", { shape: 0.95, geometry: 0.88 }],
  ["Circle", { shape: 0.98, geometry: 0.86 }],
  ["Triangle", { shape: 0.97, geometry: 0.85 }],
  ["Hexagon", { shape: 0.95, geometry: 0.83 }],
  ["Ellipse", { shape: 0.93, geometry: 0.80 }],

  ["Copper", { metal: 0.95, element: 0.81 }],
  ["Iron", { metal: 0.97, element: 0.84 }],
  ["Silver", { metal: 0.96, element: 0.79 }],
  ["Gold", { metal: 0.96, element: 0.80 }],
  ["Tin", { metal: 0.91, element: 0.74 }],

  ["Amazon", { company: 0.97, river: 0.59 }],
  ["Apple", { company: 0.97, fruit: 0.71 }],
  ["Oracle", { company: 0.93, prophecy: 0.55 }],
  ["Tesla", { company: 0.96, inventor: 0.66 }],
  ["Nvidia", { company: 0.94, ai: 0.83 }],

  ["Falcon", { bird: 0.95, predator: 0.74 }],
  ["Eagle", { bird: 0.97, predator: 0.79 }],
  ["Heron", { bird: 0.90, wetland: 0.62 }],
  ["Raven", { bird: 0.94, dark: 0.68 }],
  ["Robin", { bird: 0.92, garden: 0.57 }],

  ["Crown", { royalty: 0.96 }],
  ["Throne", { royalty: 0.94 }],
  ["Sceptre", { royalty: 0.91 }],
  ["Tiara", { royalty: 0.90, gem: 0.42 }],

  ["Python", { programming: 0.98, animal: 0.44 }],
  ["Java", { programming: 0.96, coffee: 0.49 }],
  ["RubyLang", { programming: 0.95, gem: 0.41 }],
  ["Rust", { programming: 0.95, decay: 0.43 }],
  ["Go", { programming: 0.91, movement: 0.30 }],

  ["Anchor", { nautical: 0.95 }],
  ["Harpoon", { nautical: 0.88, weapon: 0.60 }],
  ["Keel", { nautical: 0.91 }],
  ["Mast", { nautical: 0.93 }],

  ["Pyramid", { monument: 0.95, shape: 0.44 }],
  ["Obelisk", { monument: 0.93 }],
  ["Colosseum", { monument: 0.90, rome: 0.60 }],
  ["Parthenon", { monument: 0.91, greek: 0.70 }],

  ["Lime", { fruit: 0.93, green: 0.61 }],
  ["Pear", { fruit: 0.94, green: 0.52 }],
  ["Peach", { fruit: 0.94, orange: 0.55 }],
  ["Plum", { fruit: 0.93, purple: 0.58 }],
  ["Mango", { fruit: 0.95, tropical: 0.74 }],

  ["Quartz", { mineral: 0.95 }],
  ["Granite", { rock: 0.95 }],
  ["Basalt", { rock: 0.94 }],
  ["Marble", { rock: 0.93, monument: 0.35 }],
  ["Slate", { rock: 0.92 }]
].map(([text, tags], i) => ({
  id: `e${i + 1}`,
  text,
  tags
}));
