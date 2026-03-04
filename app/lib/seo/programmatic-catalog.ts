/**
 * Programmatic SEO Catalog — 56 cuisine × city landing pages.
 * Each entry has unique intro and body content to avoid duplicate/thin pages.
 */

export interface ProgrammaticPage {
  cuisineSlug: string;
  cuisineLabel: string;
  citySlug: string;
  cityLabel: string;
  neighborhood?: string;
  uniqueIntro: string;
  uniqueBody: string;
  targetKeyword: string;
  secondaryKeywords: string[];
}

// ─── Cuisine Variants (8) ────────────────────────────────────

const cuisines = [
  { slug: 'contemporary-american-restaurant', label: 'Contemporary American Restaurant' },
  { slug: 'fine-dining', label: 'Fine Dining' },
  { slug: 'seasonal-tasting-menu', label: 'Seasonal Tasting Menu' },
  { slug: 'tasting-menu-restaurant', label: 'Tasting Menu Restaurant' },
  { slug: 'private-dining', label: 'Private Dining' },
  { slug: 'farm-to-table-restaurant', label: 'Farm to Table Restaurant' },
  { slug: 'new-american-cuisine', label: 'New American Cuisine' },
  { slug: 'chef-tasting-menu', label: "Chef's Tasting Menu" },
] as const;

// ─── City / Neighborhood Variants (7) ───────────────────────

const cities = [
  { slug: 'new-york', label: 'New York' },
  { slug: 'manhattan', label: 'Manhattan' },
  { slug: 'downtown-manhattan', label: 'Downtown Manhattan', neighborhood: 'Downtown Manhattan' },
  { slug: 'tribeca', label: 'Tribeca', neighborhood: 'Tribeca' },
  { slug: 'soho', label: 'SoHo', neighborhood: 'SoHo' },
  { slug: 'west-village', label: 'West Village', neighborhood: 'the West Village' },
  { slug: 'flatiron', label: 'Flatiron District', neighborhood: 'the Flatiron District' },
] as const;

// ─── Unique Content Map ─────────────────────────────────────
// Key format: "cuisineSlug/citySlug"

const uniqueContent: Record<string, { intro: string; body: string }> = {
  // ── contemporary-american-restaurant ──
  'contemporary-american-restaurant/new-york': {
    intro: 'The Meridian defines contemporary American dining in New York City with a menu that draws on global techniques and the finest regional ingredients. Every plate tells a story of modern culinary craft rooted in American tradition.',
    body: 'At The Meridian, contemporary American cuisine is reimagined through the lens of global culinary traditions. Chef Marcus Bellamy\'s menu weaves together classical French technique, Japanese precision, and the bold flavors of the American South — all anchored by partnerships with farms and fisheries within 200 miles of Manhattan.\n\nFrom our signature dry-aged wagyu with smoked bone marrow to delicate Hudson Valley foie gras with seasonal stone fruit, each dish captures the energy and ambition of New York itself. The dining room — with its warm walnut paneling and candlelit tables — provides an intimate setting for guests seeking a refined yet approachable evening.',
  },
  'contemporary-american-restaurant/manhattan': {
    intro: 'Manhattan\'s dining landscape demands excellence, and The Meridian rises to the occasion with inventive American plates that honor tradition while embracing innovation. Our seasonally rotating menu reflects the best of what the region offers.',
    body: 'Situated in the cultural heart of Manhattan, The Meridian represents the next chapter in contemporary American cooking. Our kitchen team sources from a network of over forty regional purveyors — from Montauk dayboat fishermen to Catskill mushroom foragers — ensuring every ingredient arrives at peak flavor and freshness.\n\nThe result is a menu that feels both timeless and surprising. Dishes like our coal-roasted beets with whipped ricotta and black walnut, or our pan-seared Peconic Bay scallops with celery root and brown butter, showcase the depth and range of American terroir. Paired with our acclaimed cocktail program, dinner at The Meridian is an experience that captures the pulse of Manhattan dining.',
  },
  'contemporary-american-restaurant/downtown-manhattan': {
    intro: 'Downtown Manhattan is a neighborhood of bold tastes and creative energy, and The Meridian fits right in with a contemporary American menu that prizes originality and seasonal inspiration. Join us for a dining experience that reflects the spirit of downtown.',
    body: 'Downtown Manhattan has long been a crucible for creative dining, and The Meridian carries that tradition forward with a menu built on partnerships with local farms and artisan producers. Chef Bellamy draws from the neighborhood\'s eclectic energy, crafting plates that surprise and delight without sacrificing the warmth of American hospitality.\n\nOur downtown location provides easy access to some of the city\'s most vibrant cultural destinations. Whether you\'re coming from a gallery opening or a night at the theater, The Meridian offers a refined setting where the food matches the occasion. The raw bar, featuring rotating selections of East Coast oysters and crudo, is the perfect way to start your evening.',
  },
  'contemporary-american-restaurant/tribeca': {
    intro: 'Tucked into the cobblestone streets of Tribeca, The Meridian offers a contemporary American dining experience that celebrates the neighborhood\'s understated sophistication. Our chef-driven menu evolves with the seasons.',
    body: 'Tribeca has always attracted diners who value substance over spectacle, and The Meridian embodies that ethos. Our contemporary American menu is built on a foundation of exceptional ingredients — Greenmarket produce, heritage breed proteins, and sustainably caught seafood — prepared with technical precision and artistic flair.\n\nThe restaurant\'s intimate Tribeca setting, with exposed brick and soft ambient lighting, creates an atmosphere ideal for meaningful conversation and memorable meals. Our wine program, curated by sommelier Claire Dubois, features over 350 labels with particular depth in Burgundy, the Rhône Valley, and emerging American producers.',
  },
  'contemporary-american-restaurant/soho': {
    intro: 'SoHo\'s artistic heritage inspires The Meridian\'s approach to contemporary American cuisine — bold, creative, and always evolving. Our menu reflects a commitment to craft and seasonal excellence in every dish.',
    body: 'In the heart of SoHo, The Meridian bridges the worlds of art and gastronomy. Our contemporary American menu is a canvas for Chef Bellamy\'s creative vision: dishes that balance visual beauty with extraordinary flavor. From our artfully composed tuna tartare with avocado crème and crispy shallots to the showstopping whole roasted branzino with herb butter and charred lemon, each course is an experience.\n\nThe SoHo dining room reflects the neighborhood\'s gallery-district aesthetic — clean lines, natural materials, and an open kitchen where the choreography of service unfolds in real time. The cocktail bar, featuring house-infused spirits and seasonal shrubs, is a destination in its own right for pre-dinner drinks.',
  },
  'contemporary-american-restaurant/west-village': {
    intro: 'The West Village is a neighborhood defined by its charm and character, and The Meridian complements it with a contemporary American menu that prioritizes warmth, quality, and genuine hospitality.',
    body: 'The Meridian brings a neighborhood spirit to contemporary American fine dining in the West Village. Our menu changes with the rhythms of the seasons, reflecting the best of what Hudson Valley farms and East Coast waters have to offer each week. Regulars know to ask about the nightly specials, which often feature rare ingredients and one-time preparations.\n\nThe restaurant\'s West Village setting — on a quiet tree-lined street just steps from the river — creates an escape from the city\'s pace. The intimate 48-seat dining room encourages the kind of leisurely, multi-course evenings that have become The Meridian\'s signature. Chef Bellamy\'s pre-fixe tasting menu is available nightly for those seeking the full journey.',
  },
  'contemporary-american-restaurant/flatiron': {
    intro: 'The Flatiron District pulses with creative energy, and The Meridian channels that vitality into a contemporary American menu that\'s as dynamic as the neighborhood itself. Experience innovative cooking in one of Manhattan\'s most exciting dining destinations.',
    body: 'Positioned at the crossroads of Midtown and Downtown, The Meridian in the Flatiron District draws a diverse crowd of food lovers, industry insiders, and discerning professionals. Our contemporary American menu reflects this energy with dishes that are both intellectually ambitious and deeply satisfying — think smoked duck breast with tart cherry gastrique and foraged greens, or butter-poached lobster with sweet corn and charred jalapeño.\n\nThe Flatiron location\'s soaring ceilings and industrial-chic design provide a dramatic backdrop for celebratory dinners and power lunches alike. Our private dining room, The Library, seats up to 40 guests and is fully equipped for corporate events, rehearsal dinners, and milestone celebrations.',
  },

  // ── fine-dining ──
  'fine-dining/new-york': {
    intro: 'The Meridian embodies the art of fine dining in New York City — a city where culinary excellence is the standard and every detail matters. Our multi-course menus showcase the pinnacle of seasonal American cooking.',
    body: 'Fine dining in New York demands flawless execution, and The Meridian delivers on every front. From the moment you step through our doors, every element has been considered: the weight of the silverware, the temperature of the room, the timing of each course. Chef Marcus Bellamy\'s menus are studies in balance and precision, built on a deep understanding of flavor, texture, and the subtle art of surprise.\n\nOur service team, led by General Manager Sophie Laurent, brings warmth and knowledge to every interaction. The wine program spans over 350 labels with particular expertise in aged Burgundy and emerging American producers. For those seeking the ultimate experience, our seven-course tasting menu with wine pairings offers a journey through The Meridian\'s culinary philosophy.',
  },
  'fine-dining/manhattan': {
    intro: 'Manhattan sets the global benchmark for fine dining, and The Meridian stands among the city\'s most celebrated restaurants. Our commitment to seasonal excellence and impeccable service defines every evening.',
    body: 'The Meridian occupies a special place in Manhattan\'s fine dining landscape — sophisticated enough for the city\'s most discerning palates, yet warm enough to feel like a neighborhood gem. Our kitchen team\'s dedication to sourcing and preparation is evident in every detail, from hand-rolled pastas to dry-aged meats to house-fermented accompaniments that add depth and complexity to each plate.\n\nThe dining room\'s design pays homage to Manhattan\'s golden age of hospitality — polished brass, deep leather banquettes, and soft candlelight create an atmosphere of timeless elegance. Our pre-theater menu, available Tuesday through Thursday, makes The Meridian accessible for an exceptional dinner before curtain time at Lincoln Center or Broadway.',
  },
  'fine-dining/downtown-manhattan': {
    intro: 'Downtown Manhattan\'s fine dining scene thrives on innovation, and The Meridian brings a chef-driven sensibility that honors classical technique while embracing contemporary creativity. Reserve your table for an unforgettable evening.',
    body: 'In a neighborhood known for pushing boundaries, The Meridian\'s fine dining approach stands out for its disciplined elegance. Chef Bellamy trained in the kitchens of Lyon and Tokyo before returning to New York, and that multicultural foundation infuses every dish with a sense of discovery. The menu evolves weekly, reflecting the rapid pace of seasonal change and the kitchen\'s relentless pursuit of perfection.\n\nDowntown Manhattan diners appreciate The Meridian\'s commitment to substance. There are no gimmicks here — just beautifully sourced ingredients, masterful technique, and a service team that anticipates every need. The cheese course, featuring selections from Murray\'s and artisan producers across the Northeast, is a highlight for many guests.',
  },
  'fine-dining/tribeca': {
    intro: 'Tribeca\'s quiet sophistication is the perfect backdrop for The Meridian\'s approach to fine dining — intimate, ingredient-focused, and deeply personal. Discover why locals and visitors alike count us among the neighborhood\'s essential dining destinations.',
    body: 'Fine dining in Tribeca carries a distinct character — less about spectacle and more about the quality of the experience from first sip to final bite. The Meridian embraces this philosophy with a menu that lets extraordinary ingredients speak for themselves. Our relationships with family-owned farms, heritage breed ranchers, and small-boat fishermen ensure that what arrives on your plate represents the very best of the season.\n\nThe intimate Tribeca dining room seats just 48 guests, creating an atmosphere of exclusivity and personal attention. Our sommelier offers tableside consultations to match wines to your meal, and the kitchen is always happy to accommodate dietary preferences and allergies with alternative preparations that never feel like compromises.',
  },
  'fine-dining/soho': {
    intro: 'SoHo\'s creative pulse meets culinary artistry at The Meridian, where fine dining is elevated by a chef\'s artist eye and a commitment to seasonal perfection. Experience a menu that treats every plate as a composition.',
    body: 'The Meridian brings fine dining to SoHo with a visual and gastronomic sensibility inspired by the neighborhood\'s art-world heritage. Chef Bellamy approaches each plate as a composition — balancing color, texture, and negative space with the same intentionality a painter brings to canvas. But beauty alone is never enough: every dish must deliver depth of flavor that rewards exploration.\n\nThe SoHo dining room reflects this aesthetic rigor with its gallery-white walls, statement lighting, and curated tableware sourced from Japanese ceramicists and local artisans. The result is a fine dining experience that engages all the senses. Our weekend brunch service, featuring a condensed tasting format, has become a sought-after reservation in the SoHo dining scene.',
  },
  'fine-dining/west-village': {
    intro: 'The West Village has a long tradition of intimate, world-class restaurants, and The Meridian proudly carries that legacy forward. Our fine dining experience prioritizes connection — to the food, the people at your table, and the rhythms of the season.',
    body: 'There\'s something about the West Village that invites you to slow down, and The Meridian\'s fine dining experience is designed around that unhurried pace. Our multi-course menus are structured as journeys — each course building on the last, with palate cleansers and amuse-bouches that add moments of surprise between the main acts. Chef Bellamy\'s menus are crafted to be experienced, not just consumed.\n\nThe West Village location\'s garden-level entrance opens into a candlelit room that feels worlds away from the city above. Regular guests describe it as their private dining room — a place where birthdays, anniversaries, and quiet Wednesday evenings all receive the same extraordinary attention. Our award-winning pastry program, led by Pastry Chef Amara Osei, concludes every meal with a memorable finale.',
  },
  'fine-dining/flatiron': {
    intro: 'The Flatiron District\'s storied dining scene gains another essential destination with The Meridian. Our fine dining experience combines ambitious cooking with the kind of generous hospitality that turns first-time guests into regulars.',
    body: 'The Flatiron District has seen restaurants come and go, but The Meridian has earned its place as a neighborhood fixture through consistent excellence. Our fine dining approach is rooted in classical discipline but expressed with modern confidence — expect dishes that honor the canon while offering genuinely new flavors and combinations. The seven-course tasting menu is the best way to experience the kitchen\'s full range.\n\nThe Flatiron dining room\'s industrial architecture — cast-iron columns, exposed brick, twenty-foot ceilings — provides a dramatic contrast to the precision of the plating. This tension between rugged and refined is intentional: it reflects The Meridian\'s philosophy that great dining should feel exciting, not stuffy. Our bar program, featuring vintage-inspired cocktails and rare spirits, draws a dedicated following of its own.',
  },

  // ── seasonal-tasting-menu ──
  'seasonal-tasting-menu/new-york': {
    intro: 'The Meridian\'s seasonal tasting menu captures New York\'s culinary ambition in five to seven courses of extraordinary cooking. Each tasting unfolds like a story, guided by what\'s ripest, freshest, and most inspiring from our farm partners.',
    body: 'The seasonal tasting menu at The Meridian is our most complete expression of culinary craft. Updated monthly to reflect the rhythm of the growing season, each iteration tells a different story — spring brings delicate pea tendrils and morels, summer celebrates stone fruits and heirloom tomatoes, autumn deepens with squash and game, and winter warms with root vegetables and braises.\n\nEvery course is designed to build on the last, creating a cohesive arc from opening bite to final dessert. Wine pairings, selected by Sommelier Claire Dubois, are available for each menu and include both classic regions and adventurous discoveries. The tasting menu experience represents the most intimate way to experience Chef Bellamy\'s vision.',
  },
  'seasonal-tasting-menu/manhattan': {
    intro: 'Manhattan diners expect excellence, and The Meridian\'s seasonal tasting menu delivers with a multi-course journey that changes with the calendar. Trust our kitchen to reveal the season\'s finest ingredients in unexpected and unforgettable ways.',
    body: 'The seasonal tasting menu has become The Meridian\'s signature offering for Manhattan diners seeking something beyond a standard dinner. Each month, Chef Bellamy and his team create a new menu from scratch, drawing on what\'s available at the Union Square Greenmarket, from our partnered CSA farms, and from specialty purveyors who hold their rarest finds for restaurants that will treat them with care.\n\nThe experience is designed for the curious and the adventurous. You\'ll encounter ingredients and techniques you might not choose from an à la carte menu — but that\'s the point. Our tasting menu guests consistently tell us they discovered flavors they never knew they loved. Available Tuesday through Saturday, with optional wine or non-alcoholic beverage pairings.',
  },
  'seasonal-tasting-menu/downtown-manhattan': {
    intro: 'Downtown Manhattan\'s creative dining culture is the ideal setting for The Meridian\'s seasonal tasting menu — a multi-course experience that celebrates the intersection of technique, terroir, and the changing seasons.',
    body: 'Our seasonal tasting menu draws inspiration from downtown Manhattan\'s tradition of culinary innovation. Rather than following trends, Chef Bellamy\'s monthly menus are driven by a simple question: what does this moment in the growing season make possible? The answer unfolds across five to seven courses that balance familiar comfort with genuine surprise.\n\nThe downtown dining room provides an intimate setting for the tasting experience, with tables spaced for conversation and a pace of service that allows each course to be savored. Guests who opt for the wine pairing will discover selections that complement and elevate each dish, including occasional pours of rare vintages from our cellar\'s reserve collection.',
  },
  'seasonal-tasting-menu/tribeca': {
    intro: 'Tribeca\'s reputation for exceptional dining finds expression in The Meridian\'s seasonal tasting menu — a carefully paced, multi-course dinner that transforms the freshest ingredients of the moment into something extraordinary.',
    body: 'In the quiet elegance of our Tribeca dining room, the seasonal tasting menu becomes a meditative experience. Each course arrives with a brief explanation from your server — the provenance of the main ingredient, the technique that unlocks its potential, the thought behind its pairing. This isn\'t performance; it\'s an invitation to engage more deeply with what\'s on your plate.\n\nThe Tribeca tasting menu is available as a five-course or seven-course format, allowing guests to choose their level of immersion. Both formats include amuse-bouches and a pre-dessert course, and both can be paired with wines, sake selections, or a non-alcoholic beverage program that has earned its own following among health-conscious diners.',
  },
  'seasonal-tasting-menu/soho': {
    intro: 'The Meridian\'s seasonal tasting menu in SoHo is a sensory journey that treats each course as a composition of flavor, texture, and beauty. Allow our kitchen to guide you through the season\'s most compelling ingredients.',
    body: 'SoHo diners are drawn to The Meridian\'s seasonal tasting menu for its creative ambition and visual artistry. Each course is plated with the care of a gallery installation — but the beauty is never superficial. Beneath the aesthetics lies deep technique and intense flavor: slow reductions, fermented accents, and textures that range from silky to shattering.\n\nThe SoHo tasting experience is particularly popular for special occasions and date nights. Our service team excels at reading the room, adjusting pace and formality to match the energy of each table. Whether you\'re celebrating a milestone or simply indulging in a Tuesday evening, the seasonal tasting menu delivers one of SoHo\'s most memorable dining experiences.',
  },
  'seasonal-tasting-menu/west-village': {
    intro: 'In the West Village, The Meridian\'s seasonal tasting menu unfolds at a pace that matches the neighborhood\'s leisurely charm. Five to seven courses of seasonally inspired cooking, designed to turn an evening into an occasion.',
    body: 'The West Village has always been a place where great meals happen slowly, and The Meridian\'s seasonal tasting menu embraces that tempo. Courses arrive at intervals that allow for conversation, reflection, and the simple pleasure of anticipation. Chef Bellamy draws on the West Village\'s history as a gathering place for artists and thinkers, creating menus that reward attention and curiosity.\n\nThe tasting menu changes monthly and is never repeated — each iteration is a unique response to the season. Past highlights include a spring menu centered on ramps, fiddleheads, and soft-shell crab, and a winter menu featuring black truffle, celery root, and venison from a family farm in the Catskills.',
  },
  'seasonal-tasting-menu/flatiron': {
    intro: 'The Flatiron District\'s dynamic dining scene is the perfect stage for The Meridian\'s seasonal tasting menu — a bold, chef-driven experience that captures the energy of the neighborhood in every course.',
    body: 'The Meridian\'s Flatiron location brings extra energy to the seasonal tasting menu experience. The open kitchen allows tasting menu guests to watch the brigade at work, adding a theatrical dimension to the evening. Courses emerge in rapid succession during the early seating, or at a more relaxed pace for later reservations — the kitchen adjusts to match your evening\'s rhythm.\n\nThe Flatiron tasting menu is particularly well-suited for group dining. Tables of four or more can opt for a family-style tasting format, with larger portions served for sharing. This communal approach to the tasting menu has become one of The Meridian\'s most requested experiences, perfect for birthday celebrations, reunions, and holiday gatherings.',
  },

  // ── tasting-menu-restaurant ──
  'tasting-menu-restaurant/new-york': {
    intro: 'The Meridian stands among New York\'s premier tasting menu restaurants, offering multi-course experiences that showcase Chef Bellamy\'s mastery of technique, sourcing, and seasonal creativity.',
    body: 'As a tasting menu restaurant, The Meridian occupies a unique space in New York\'s culinary landscape. While many restaurants offer tasting menus as an option, it\'s the heart of what we do. Our kitchen is structured around the tasting format — every station, every prep list, every daily market run is oriented toward creating multi-course experiences that cohere into something greater than the sum of their parts.\n\nGuests can choose between the five-course menu, which offers a concise survey of the season\'s highlights, or the seven-course journey, which explores deeper themes and includes more adventurous preparations. Both are available with wine pairings curated by our sommelier, and both conclude with Pastry Chef Amara Osei\'s extraordinary dessert compositions.',
  },
  'tasting-menu-restaurant/manhattan': {
    intro: 'Among Manhattan\'s tasting menu restaurants, The Meridian is distinguished by its unwavering focus on seasonal ingredients, its warm hospitality, and a wine program that elevates every course.',
    body: 'Manhattan is home to some of the world\'s great tasting menu restaurants, and The Meridian earns its place through substance and consistency. Night after night, our kitchen delivers multi-course menus that balance innovation with accessibility — you\'ll encounter bold flavors and unfamiliar techniques, but always in service of deliciousness rather than novelty for its own sake.\n\nThe tasting menu format allows our kitchen to take risks that wouldn\'t work on an à la carte menu. A single ingredient might appear in multiple preparations across the evening, revealing different facets of its character. A course might feature just two elements, perfectly composed. The format gives our chefs creative freedom, and the results are consistently among the most exciting dining experiences in Manhattan.',
  },
  'tasting-menu-restaurant/downtown-manhattan': {
    intro: 'Downtown Manhattan\'s food scene rewards creativity, and The Meridian\'s tasting menu restaurant delivers exactly that — progressive, seasonal multi-course dining in an intimate downtown setting.',
    body: 'The Meridian operates as a tasting menu restaurant in the truest sense: the multi-course format isn\'t an add-on but the foundation of our culinary identity. Downtown Manhattan\'s food-savvy diners appreciate this commitment. Our tasting menus reflect the neighborhood\'s adventurous palate with preparations that draw on fermentation, smoke, and global spice traditions alongside classical French technique.\n\nThe downtown location adds to the experience. The restaurant\'s industrial-chic interior, with its open kitchen pass and dramatic overhead lighting, provides a dynamic backdrop for the unfolding courses. Guests seated at the chef\'s counter receive an especially immersive experience, with direct interaction with the kitchen team throughout the meal.',
  },
  'tasting-menu-restaurant/tribeca': {
    intro: 'The Meridian is Tribeca\'s destination tasting menu restaurant, where multi-course dinners unfold in an intimate setting of understated elegance. Each evening\'s menu is a new chapter in our ongoing exploration of seasonal American cuisine.',
    body: 'Tribeca\'s discerning diners have made The Meridian their tasting menu restaurant of choice for its combination of culinary ambition and neighborhood warmth. Unlike the austere temples of haute cuisine, our tasting menu experience is designed to feel like an invitation into the chef\'s world — personal, spontaneous, and deeply satisfying.\n\nOur Tribeca dining room seats just 48 guests, ensuring that every table receives individual attention. The tasting menu begins with a series of snacks served at the bar before moving to the dining room for the main courses. This progression through different spaces adds variety to the evening and allows our bar team to showcase their craft cocktail and aperitif program.',
  },
  'tasting-menu-restaurant/soho': {
    intro: 'In SoHo, The Meridian operates as a tasting menu restaurant where food meets artistry. Our multi-course menus are composed with the visual and sensory sophistication that this creative neighborhood demands.',
    body: 'SoHo\'s gallery district is a fitting home for a tasting menu restaurant that treats every course as a work of art. At The Meridian, the visual presentation of each dish is inseparable from its flavor — color, texture, and composition are considered alongside taste and aroma. The result is a multi-course experience that engages all the senses.\n\nOur SoHo location attracts a clientele that appreciates this holistic approach to dining. The tasting menu is available in five-course and seven-course formats, with both vegetarian and pescatarian adaptations available on request. Our sommelier\'s pairings often include surprising selections — a skin-contact Georgian wine, a bone-dry Alsatian riesling — that challenge expectations and open new flavor dialogues with the food.',
  },
  'tasting-menu-restaurant/west-village': {
    intro: 'Nestled in the West Village, The Meridian is a tasting menu restaurant that celebrates the art of the multi-course meal. Our intimate setting and seasonally driven menus create evenings worth savoring.',
    body: 'The West Village has always been home to restaurants that prize quality over quantity, and The Meridian continues this tradition as a dedicated tasting menu restaurant. Our format is simple: trust the kitchen, settle in for the evening, and allow each course to unfold at a pace that encourages conversation and appreciation.\n\nThe West Village location\'s garden-level setting creates a sense of discovery — guests descend from the street into a warmly lit space that feels like a well-kept secret. The intimate scale of the dining room means that Chef Bellamy often visits tables personally, discussing the evening\'s menu and the stories behind the ingredients. It\'s this personal touch that distinguishes The Meridian from larger tasting menu operations.',
  },
  'tasting-menu-restaurant/flatiron': {
    intro: 'The Flatiron District\'s food enthusiasts have embraced The Meridian as their go-to tasting menu restaurant — a place where ambitious cooking meets generous hospitality in one of Manhattan\'s most energetic neighborhoods.',
    body: 'The Meridian\'s Flatiron location brings an accessible energy to the tasting menu restaurant format. The soaring industrial space, with its cast-iron columns and open kitchen, creates an atmosphere that\'s more dynamic than the hushed reverence of traditional fine dining. Here, the tasting menu is an event — courses arrive with energy, the kitchen hums with activity, and the room buzzes with the excitement of discovery.\n\nThe Flatiron tasting menu experience is ideal for groups celebrating special occasions. Our private dining room, The Library, can be reserved for exclusive tasting menu events with custom menus and dedicated service. Corporate clients appreciate the flexibility and the impressive setting for client entertainment and team celebrations.',
  },

  // ── private-dining ──
  'private-dining/new-york': {
    intro: 'The Meridian\'s private dining rooms offer an exclusive setting for celebrations, corporate events, and intimate gatherings in the heart of New York City. Customized menus and dedicated service ensure your event is flawless.',
    body: 'Private dining at The Meridian transforms any occasion into something extraordinary. Our two dedicated spaces — The Salon, accommodating 12 to 18 guests, and The Library, seating up to 40 — provide elegant settings for rehearsal dinners, milestone birthdays, corporate retreats, and holiday celebrations. Each space features its own dedicated service team, customizable lighting, and state-of-the-art AV capabilities.\n\nOur events team works closely with hosts to create custom menus tailored to dietary preferences, cultural traditions, and the specific character of each occasion. From passed canapés and champagne receptions to multi-course seated dinners with wine pairings, every detail is considered. We also offer a dedicated event coordinator for larger parties to manage logistics, vendor coordination, and day-of execution.',
  },
  'private-dining/manhattan': {
    intro: 'Manhattan\'s most memorable private dining experiences begin at The Meridian. Our dedicated rooms and personalized service create the perfect setting for every kind of celebration and corporate event.',
    body: 'In a city full of private dining options, The Meridian stands apart through the quality of our food, the flexibility of our spaces, and the attentiveness of our events team. Whether you\'re planning an intimate anniversary dinner for 12 or a corporate holiday party for 40, we bring the same level of care and creativity to every event.\n\nThe Salon, our more intimate space, features a communal table surrounded by floor-to-ceiling bookshelves and soft ambient lighting — perfect for dinner parties and family celebrations. The Library, our larger room, offers a versatile layout that can accommodate seated dinners, cocktail receptions, or presentation-style events with audiovisual support. Both rooms are available for lunch and dinner service, with brunch availability on weekends.',
  },
  'private-dining/downtown-manhattan': {
    intro: 'Downtown Manhattan\'s most stylish private dining destination, The Meridian offers bespoke event experiences in two thoughtfully designed spaces. From intimate dinners to cocktail receptions, we make every gathering exceptional.',
    body: 'The Meridian\'s private dining program brings the restaurant\'s culinary excellence into an exclusive setting. Our downtown Manhattan location attracts hosts who want their events to reflect the neighborhood\'s creative sophistication — think gallery-opening energy with the substance of a chef\'s table dinner.\n\nOur events team specializes in creating custom experiences that go beyond standard private dining packages. We can arrange wine education components led by our sommelier, kitchen tours with Chef Bellamy, and interactive cooking demonstrations that transform a private dinner into an immersive culinary event. For corporate clients, we offer branded menu cards, custom cocktail naming, and seamless integration with your event planning team.',
  },
  'private-dining/tribeca': {
    intro: 'Host your next celebration in The Meridian\'s private dining rooms in Tribeca — intimate, elegant spaces where custom menus and dedicated service create evenings your guests will remember.',
    body: 'The Meridian\'s Tribeca location brings a neighborhood intimacy to private dining that larger venues can\'t match. Our private rooms feel like extensions of the main dining room — refined, warm, and unmistakably special. The Salon\'s communal table seats up to 18 guests in an atmosphere that encourages conversation, while The Library\'s flexible layout accommodates everything from seated dinners to standing receptions.\n\nTribeca hosts particularly appreciate our approach to menu customization. Rather than offering fixed packages, we build each private dining menu from scratch based on the season, the occasion, and the preferences of the host and their guests. Chef Bellamy personally oversees menu development for all private events, ensuring that the food matches the caliber of the regular dining room experience.',
  },
  'private-dining/soho': {
    intro: 'The Meridian\'s private dining rooms in SoHo combine gallery-worthy design with world-class cuisine. Host your next event in a setting that\'s as visually striking as the food is exceptional.',
    body: 'SoHo\'s creative community has discovered The Meridian as the ideal venue for private dining events that demand style and substance. Our private spaces reflect the neighborhood\'s design sensibility — clean lines, curated art, and lighting that flatters every guest and every plate. The result is a backdrop that elevates any occasion, from fashion week dinners to launch events to family celebrations.\n\nOur SoHo private dining program includes full event coordination, from menu planning through day-of execution. We can accommodate dietary restrictions across large groups, arrange floral and decor partnerships, and coordinate with external vendors for photography, entertainment, and transportation. Our commitment is to make hosting effortless while delivering an experience that exceeds expectations.',
  },
  'private-dining/west-village': {
    intro: 'The West Village\'s most charming private dining experience awaits at The Meridian. Our intimate rooms are designed for celebrations that call for exceptional food, personal service, and an atmosphere of warmth.',
    body: 'Private dining in the West Village takes on a special character at The Meridian. Our spaces feel less like corporate event rooms and more like a friend\'s impossibly well-appointed dining room — a place where the focus is on connection, conversation, and extraordinary food. Hosts often tell us their guests assumed the evening was catered at a private residence, which is exactly the atmosphere we cultivate.\n\nThe West Village location\'s garden-level entrance adds an element of discovery to private events. Guests arrive feeling they\'ve found a hidden gem, and the evening unfolds with a sense of intimacy that larger venues can\'t replicate. Our events team handles all logistics — from custom menu cards to AV setup to valet coordination — so hosts can focus entirely on their guests.',
  },
  'private-dining/flatiron': {
    intro: 'The Meridian\'s Flatiron District private dining rooms combine dramatic architecture with refined hospitality. Our versatile spaces accommodate everything from intimate dinners to large corporate events.',
    body: 'The Flatiron District\'s central location makes The Meridian\'s private dining rooms ideal for corporate events, team celebrations, and gatherings that draw guests from across the city. Our Library space, with its soaring ceilings and industrial-chic design, creates an impressive setting for presentations, cocktail receptions, and seated dinners for up to 40 guests.\n\nThe Flatiron private dining program offers particular value for corporate clients. We can arrange multi-session events — lunch workshops followed by evening dinners, or consecutive evening events for conference groups. Our events team manages all technical requirements, including projection, sound, and WiFi access, while our kitchen delivers menus that match the professional caliber of your event.',
  },

  // ── farm-to-table-restaurant ──
  'farm-to-table-restaurant/new-york': {
    intro: 'The Meridian is New York City\'s farm-to-table restaurant of choice, where deep relationships with regional farmers and producers shape a menu that changes with the seasons and celebrates the bounty of the Northeast.',
    body: 'Farm-to-table isn\'t a marketing term at The Meridian — it\'s the organizing principle of our entire operation. Chef Bellamy personally visits our partner farms throughout the growing season, working with growers to plan plantings that will inspire future menus. This collaborative approach means that our ingredients aren\'t just fresh — they\'re grown specifically for our kitchen.\n\nOur farm partnerships span the Hudson Valley, the Catskills, Long Island\'s North Fork, and New Jersey\'s garden corridor. Guests who are curious about sourcing can ask any server about the provenance of their meal — our team is trained to tell the story behind every dish. The result is a dining experience that connects you to the land and the people who cultivate it, right here in the heart of New York City.',
  },
  'farm-to-table-restaurant/manhattan': {
    intro: 'In Manhattan, The Meridian brings farm-to-table dining to life with a menu built on decades of relationships with regional growers, ranchers, and fishermen. Taste the difference that genuine sourcing makes.',
    body: 'Manhattan may seem far from farmland, but The Meridian bridges that distance through a sourcing network that has been built over fifteen years of direct farm relationships. Every week, our purchasing team coordinates deliveries from over forty regional producers — from Arcadian Farm\'s biodynamic vegetables to heritage-breed pork from a family operation in the Berkshires.\n\nThe farm-to-table commitment extends beyond the plate to our bar program, where house-made bitters, shrubs, and infusions showcase seasonal fruits and botanicals. Our cocktail menu changes quarterly to reflect available ingredients, and several signature drinks incorporate farm-direct elements like fresh herb syrups and pressed vegetable juices. This holistic approach to sourcing creates a dining experience that\'s impossible to replicate.',
  },
  'farm-to-table-restaurant/downtown-manhattan': {
    intro: 'Downtown Manhattan\'s farm-to-table movement finds its finest expression at The Meridian, where every dish is a celebration of regional agriculture and the chefs who transform it into art.',
    body: 'The Meridian\'s farm-to-table philosophy runs deeper than most restaurants dare to go. We don\'t just buy from farmers — we participate in the agricultural cycle. Chef Bellamy consults on crop varieties, our kitchen team visits farms during harvest, and we accept imperfect produce that other restaurants reject, finding creative uses for every part of every ingredient.\n\nThis commitment to zero waste and whole-animal, whole-vegetable cooking gives our downtown Manhattan menu a distinctive character. You\'ll find dishes that celebrate overlooked cuts, utilize vegetable scraps in ferments and stocks, and transform humble ingredients into something elegant. The result is cooking that\'s not only delicious but deeply responsible — a farm-to-table approach that respects the full chain from seed to plate.',
  },
  'farm-to-table-restaurant/tribeca': {
    intro: 'Tribeca\'s farm-to-table dining scene reaches its apex at The Meridian, where a network of trusted growers supplies ingredients that arrive daily at our kitchen — often harvested that very morning.',
    body: 'The Meridian\'s Tribeca location sits just blocks from the original Washington Market, where New York\'s farm-to-table story began over a century ago. We honor that heritage with sourcing practices that would make our predecessors proud: direct relationships with family farms, seasonal menus that follow the harvest calendar, and a root cellar program that preserves peak-season ingredients for use throughout the year.\n\nTribeca guests appreciate the transparency of our sourcing. Each night\'s menu includes brief notes about key ingredients and their origins, and our servers are trained to share the stories behind the food. For those who want to go deeper, our quarterly farm dinners — held in partnership with featured producers — offer an immersive experience that includes a farm visit, cooking demonstration, and multi-course dinner.',
  },
  'farm-to-table-restaurant/soho': {
    intro: 'The Meridian in SoHo is where farm-to-table meets fine dining — a restaurant that elevates locally sourced ingredients through technique and artistry, proving that sustainability and luxury are natural partners.',
    body: 'SoHo\'s conscious consumers have embraced The Meridian as a farm-to-table restaurant that delivers on every front: sustainability, flavor, and beauty. Our menu reads like a who\'s who of the region\'s best producers — Violet Hill Farm lamb, Breezy Hill Orchard apples, Peconic Gold oysters — and each ingredient is treated with the respect its provenance deserves.\n\nThe farm-to-table commitment in our SoHo location extends to our design and operations. Our tableware includes pieces from local ceramicists, our linens are sourced from a family textile mill in Vermont, and our cleaning products are biodegradable and locally made. We believe that farm-to-table is a philosophy, not just a menu strategy — and our guests tell us they can taste the difference.',
  },
  'farm-to-table-restaurant/west-village': {
    intro: 'The West Village\'s love affair with local food finds its culinary home at The Meridian — a farm-to-table restaurant where the Greenmarket\'s finest ingredients become extraordinary seasonal dishes.',
    body: 'The Meridian\'s West Village location draws daily inspiration from the Union Square Greenmarket, just a short walk from our kitchen door. Our chef de cuisine visits the market four mornings a week, selecting produce at peak ripeness and occasionally discovering new ingredients that inspire impromptu specials — the kind of cooking you can only do when you\'re truly connected to local agriculture.\n\nThe West Village community\'s commitment to local food mirrors our own, creating a virtuous cycle of support for regional agriculture. Many of our regular guests are themselves gardeners, home cooks, and CSA members who appreciate the quality of genuinely farm-to-table cooking. Our wine list echoes this local-first philosophy with a dedicated section of New York State wines from Long Island, the Finger Lakes, and the Hudson Valley.',
  },
  'farm-to-table-restaurant/flatiron': {
    intro: 'The Flatiron District\'s proximity to Union Square Greenmarket makes it a natural home for The Meridian\'s farm-to-table approach. Our kitchen transforms the market\'s best into multi-course dining experiences.',
    body: 'Location matters for a farm-to-table restaurant, and The Meridian\'s Flatiron District address puts us steps from the Union Square Greenmarket — the epicenter of New York\'s local food movement. Our purchasing relationships with Greenmarket vendors span years, giving us first access to limited-availability items like wild ramps, sunchokes, and heirloom tomato varieties grown exclusively for restaurants.\n\nThe Flatiron farm-to-table experience extends to our private dining and events program. Hosts can request menus built around specific farms or producers, creating themed dinners that celebrate the region\'s agricultural diversity. Past events have featured all-mushroom dinners in partnership with a Catskills forager and whole-hog dinners showcasing heritage breeds from a family ranch.',
  },

  // ── new-american-cuisine ──
  'new-american-cuisine/new-york': {
    intro: 'The Meridian represents the leading edge of New American cuisine in New York — a style of cooking that draws from global traditions while remaining rooted in American ingredients, hospitality, and creative ambition.',
    body: 'New American cuisine is the story of a nation told through food, and The Meridian writes new chapters every season. Chef Bellamy\'s menu reflects the incredible diversity of American foodways — Southern smokehouse traditions, Pacific Northwest seafood culture, Southwestern spice, and the agricultural bounty of the Northeast — all filtered through a fine-dining lens that emphasizes precision, balance, and beauty.\n\nThis is not fusion cooking. It\'s a deeply considered approach to American dining that respects the origins of each tradition while creating something genuinely new. Dishes like our kimchi-glazed short rib with stone-ground grits, or our Maine lobster with charred corn and green chile, demonstrate how America\'s culinary traditions can coexist and elevate one another on a single plate.',
  },
  'new-american-cuisine/manhattan': {
    intro: 'Manhattan is the natural home for New American cuisine, and The Meridian embraces this heritage with a menu that channels the city\'s cultural melting pot into dishes of exceptional creativity and flavor.',
    body: 'New American cuisine in Manhattan carries a special significance — this is where immigrant food traditions have always converged, collided, and created something new. The Meridian honors this legacy with a menu that\'s as cosmopolitan as the city itself. You\'ll find Japanese-inspired crudo alongside Southern cornbread, Mediterranean herbs paired with New England seafood, and desserts that riff on Latin American dulce traditions.\n\nWhat makes our approach distinctive is the rigor behind the eclecticism. Every flavor combination is tested extensively, every cultural reference is researched and respected, and every dish must pass the ultimate test: does it taste extraordinary? The result is New American cuisine that\'s intellectually stimulating and viscerally satisfying — dinner as a reflection of Manhattan\'s boundless creative energy.',
  },
  'new-american-cuisine/downtown-manhattan': {
    intro: 'Downtown Manhattan has always been a laboratory for new ideas, and The Meridian\'s New American menu reflects that inventive spirit with dishes that challenge conventions while delivering pure culinary pleasure.',
    body: 'The Meridian\'s downtown Manhattan address places us in a neighborhood with a long history of culinary innovation. Our New American menu draws from this legacy, taking creative risks that you won\'t find in more conservative fine dining rooms. Chef Bellamy encourages experimentation in his kitchen — new techniques, unexpected pairings, and ingredients sourced from immigrant food communities across the five boroughs.\n\nThe downtown dining scene attracts eaters who are willing to be surprised, and we reward that openness with dishes that expand the definition of American cuisine. Past menu highlights include miso-cured foie gras with persimmon and black sesame, and a whole roasted cauliflower finished with curry leaf butter and pomegranate — dishes that reflect America\'s evolving palate.',
  },
  'new-american-cuisine/tribeca': {
    intro: 'Tribeca\'s food lovers have embraced The Meridian\'s New American cuisine for its ability to feel both innovative and deeply satisfying. Our menu celebrates the limitless possibilities of American cooking.',
    body: 'The Meridian brings New American cuisine to Tribeca with a menu that\'s rooted in technical excellence and fueled by creative curiosity. Chef Bellamy\'s training in both European and Asian kitchens gives him a unique perspective on American ingredients — he sees possibilities that more traditionally trained chefs might overlook, and the results are dishes that feel simultaneously familiar and revelatory.\n\nOur Tribeca regulars appreciate the way our New American menu evolves organically with the seasons and with the kitchen team\'s ongoing education. Trips to food markets in Oaxaca, Tokyo, and Marrakech inspire new dishes that are filtered through an American sensibility. The menu is a living document of our culinary curiosity, and no two visits are ever quite the same.',
  },
  'new-american-cuisine/soho': {
    intro: 'SoHo\'s creative community finds a culinary counterpart in The Meridian\'s New American menu — inventive, visually stunning, and always pushing boundaries while honoring the fundamentals of great cooking.',
    body: 'The Meridian\'s SoHo location attracts diners who see food as a creative medium, and our New American menu delivers with dishes that reward close attention. Each plate is conceived as a balance of contrasts — sweet and savory, crisp and yielding, bold and subtle — creating a dining experience that\'s as intellectually engaging as it is delicious.\n\nNew American cuisine in SoHo also means a commitment to our diverse community. Our menu features ingredients and techniques from culinary traditions across the Americas, Europe, and Asia — reflecting the global character of our neighborhood and our city. The cocktail program follows the same philosophy, with drinks that riff on traditions from mezcal to sake to craft bourbon.',
  },
  'new-american-cuisine/west-village': {
    intro: 'The West Village has a proud tradition of restaurants that define American dining, and The Meridian contributes to that legacy with a New American menu that\'s personal, seasonal, and full of heart.',
    body: 'New American cuisine in the West Village carries an intimacy that sets it apart from the more theatrical restaurants elsewhere in Manhattan. At The Meridian, this means dishes that prioritize comfort and satisfaction alongside innovation. You won\'t find molecular gastronomy or overwrought presentations — instead, you\'ll find extraordinarily well-sourced ingredients prepared with skill and served with warmth.\n\nThe West Village menu reflects the neighborhood\'s residential character. Many of our dishes are designed to evoke the feeling of eating at a very talented friend\'s dinner party — generous portions, confident seasoning, and the kind of relaxed elegance that encourages second helpings and leisurely conversation over another glass of wine.',
  },
  'new-american-cuisine/flatiron': {
    intro: 'The Flatiron District\'s food scene is defined by diversity and ambition, and The Meridian\'s New American menu fits right in with bold cooking that draws from the full spectrum of American culinary tradition.',
    body: 'The Meridian\'s Flatiron location brings New American cuisine to a neighborhood that appreciates culinary ambition. Our menu reflects the Flatiron District\'s position at the crossroads of uptown refinement and downtown creativity — dishes that are polished enough for a business dinner yet exciting enough for a food-world date night.\n\nThe Flatiron New American menu benefits from our proximity to the Union Square Greenmarket and Eataly, placing us at the epicenter of New York\'s ingredient culture. Chef Bellamy\'s team shops the market daily, and the resulting menu reads like a love letter to the region\'s producers. Paired with our cocktail program — which features seasonal variations on American classics — dinner at The Meridian is a comprehensive New American experience.',
  },

  // ── chef-tasting-menu ──
  'chef-tasting-menu/new-york': {
    intro: 'The Meridian\'s chef\'s tasting menu is Chef Marcus Bellamy\'s most personal expression — a multi-course journey guided entirely by the chef\'s inspiration and the day\'s finest ingredients. Available by reservation only.',
    body: 'The chef\'s tasting menu at The Meridian represents the highest level of culinary craft in our kitchen. Unlike our standard tasting menu, which follows a set seasonal theme, the chef\'s tasting menu is composed daily based on what inspires Chef Bellamy — a perfect fish delivered that morning, an unusual variety of heirloom vegetable from a farmer friend, or a technique he\'s been perfecting for months.\n\nThis format demands trust from both the kitchen and the guest, and the result is a deeply personal dining experience. Courses may number anywhere from seven to ten, and the flow of the meal is adjusted in real time based on the table\'s response. Wine pairings for the chef\'s tasting menu draw from our reserve cellar, including allocated wines and library vintages that aren\'t available on the standard wine list.',
  },
  'chef-tasting-menu/manhattan': {
    intro: 'Among Manhattan\'s chef\'s tasting menus, The Meridian offers an experience that\'s spontaneous, deeply seasonal, and reflective of Chef Bellamy\'s years of training across three continents. Surrender to the kitchen and be rewarded.',
    body: 'Manhattan diners seeking the ultimate culinary experience gravitate to The Meridian\'s chef\'s tasting menu — a format that strips away the menu entirely and places full trust in the kitchen. Chef Bellamy thrives in this format, treating each evening\'s chef\'s tasting as a creative challenge: how to tell a compelling story through seven to ten courses using only the day\'s most exceptional ingredients.\n\nThe chef\'s tasting experience at The Meridian includes elements you won\'t find on any other menu: tableside preparations, one-time courses that exist only for that evening, and personal visits from Chef Bellamy to discuss the inspiration behind key dishes. For wine lovers, our sommelier creates bespoke pairings that are as spontaneous and personal as the food.',
  },
  'chef-tasting-menu/downtown-manhattan': {
    intro: 'Downtown Manhattan\'s adventurous diners have made The Meridian\'s chef\'s tasting menu a cult favorite — a nightly improvisation that showcases Chef Bellamy\'s creative range and his obsession with perfect ingredients.',
    body: 'The chef\'s tasting menu at The Meridian\'s downtown Manhattan location has earned a devoted following among food lovers who crave surprise and discovery. There is no printed menu — instead, the evening begins with a conversation between your server and you about preferences, allergies, and your appetite for adventure. From there, the kitchen takes over.\n\nWhat makes this experience special is the caliber of improvisation. Chef Bellamy\'s years in Lyon, Tokyo, and New York have given him a vast repertoire to draw from, and the daily arrivals from our farm partners and fish markets provide the raw material for genuine creativity. Past chef\'s tasting highlights include a 12-course seafood progression showcasing the morning\'s catch, and an autumn fungi menu featuring seven varieties of wild mushrooms foraged from the Catskills.',
  },
  'chef-tasting-menu/tribeca': {
    intro: 'In Tribeca\'s intimate dining room, The Meridian\'s chef\'s tasting menu becomes a private culinary conversation between kitchen and guest. Seven to ten courses of the chef\'s most inspired cooking, available nightly.',
    body: 'The Meridian\'s Tribeca setting is the ideal environment for the chef\'s tasting menu experience. The intimate 48-seat dining room allows Chef Bellamy to maintain personal oversight of every chef\'s tasting served, ensuring that the quality and creativity meet his exacting standards. Tables are spaced generously, creating private islands of conversation where each course can be savored without distraction.\n\nThe Tribeca chef\'s tasting menu often features ingredients that are too rare or limited for the à la carte menu — a three-pound wild striped bass, a single-origin olive oil from a harvest that yielded only 200 bottles, or a cheese that the affineur holds exclusively for restaurants of this caliber. These special ingredients become the centerpieces of courses that you simply cannot experience anywhere else.',
  },
  'chef-tasting-menu/soho': {
    intro: 'The Meridian\'s chef\'s tasting menu in SoHo is a gallery of edible art — each course a study in flavor, texture, and visual composition. Let Chef Bellamy guide you through his most creative work.',
    body: 'SoHo\'s connection to the visual arts makes it the perfect neighborhood for The Meridian\'s chef\'s tasting menu, where the presentation of each course is as considered as its flavor. Chef Bellamy works with local ceramicists to create custom serviceware that complements specific preparations, and the plating of each course reflects the SoHo dining room\'s gallery-inspired aesthetic.\n\nBeyond the visual beauty, the SoHo chef\'s tasting menu delivers extraordinary depth of flavor. Courses are built on stocks and reductions that take days to prepare, ferments and pickles that develop over weeks, and techniques like hay-smoking and salt-baking that add complexity you can\'t achieve through simpler methods. The result is a multi-sensory experience that rewards the adventurous diner.',
  },
  'chef-tasting-menu/west-village': {
    intro: 'The West Village\'s most personal dining experience is The Meridian\'s chef\'s tasting menu — an evening where Chef Bellamy crafts a bespoke journey for each table, guided by the season and his daily inspiration.',
    body: 'The chef\'s tasting menu at The Meridian\'s West Village location is our most intimate offering. With just 48 seats and a limited number of chef\'s tasting reservations available each evening, the experience feels exclusive and deeply personal. Chef Bellamy often incorporates ingredients from his own kitchen garden into the menu, adding a level of provenance and care that reflects the West Village\'s connection to artisanal food culture.\n\nThe West Village chef\'s tasting unfolds at the pace of the evening. Early seatings tend to move with purpose, while later reservations allow for a more expansive journey. Both formats include amuse-bouches, palate cleansers, and a pre-dessert course that bridges the savory and sweet portions of the meal. It\'s the kind of evening that reminds you why you fell in love with dining out.',
  },
  'chef-tasting-menu/flatiron': {
    intro: 'The Flatiron District\'s most ambitious dining experience is The Meridian\'s chef\'s tasting menu — a no-menu format where Chef Bellamy\'s daily inspiration and the season\'s finest ingredients dictate the evening.',
    body: 'The Meridian\'s Flatiron location brings dramatic energy to the chef\'s tasting menu format. The open kitchen and soaring industrial space create a theatrical backdrop for what is essentially a live performance — Chef Bellamy and his team composing an evening of food in real time. Guests seated at the chef\'s counter have a front-row view of this creative process, watching courses take shape just feet from their seats.\n\nThe Flatiron chef\'s tasting menu is also the best way to experience our reserve wine program. Sommelier Claire Dubois pairs each course with selections from our deepest cellar holdings, including aged Burgundies, rare Barolos, and library-vintage California Cabernets that represent the finest of American winemaking. The combined effect of exceptional food and extraordinary wine creates an evening that lingers in memory.',
  },
};

// ─── Build Catalog ──────────────────────────────────────────

function buildCatalog(): ProgrammaticPage[] {
  const pages: ProgrammaticPage[] = [];

  for (const cuisine of cuisines) {
    for (const city of cities) {
      const key = `${cuisine.slug}/${city.slug}`;
      const content = uniqueContent[key];

      if (!content) {
        console.warn(`Missing content for: ${key}`);
        continue;
      }

      pages.push({
        cuisineSlug: cuisine.slug,
        cuisineLabel: cuisine.label,
        citySlug: city.slug,
        cityLabel: city.label,
        neighborhood: 'neighborhood' in city ? city.neighborhood : undefined,
        uniqueIntro: content.intro,
        uniqueBody: content.body,
        targetKeyword: `${cuisine.label.toLowerCase()} in ${city.label.toLowerCase()}`,
        secondaryKeywords: [
          `best ${cuisine.label.toLowerCase()} ${city.label.toLowerCase()}`,
          `${city.label.toLowerCase()} ${cuisine.label.toLowerCase()}`,
          `${cuisine.label.toLowerCase()} near ${city.label.toLowerCase()}`,
        ],
      });
    }
  }

  return pages;
}

export const programmaticCatalog = buildCatalog();

/** Look up a single page by slug pair */
export function findProgrammaticPage(
  cuisineSlug: string,
  citySlug: string,
): ProgrammaticPage | undefined {
  return programmaticCatalog.find(
    (p) => p.cuisineSlug === cuisineSlug && p.citySlug === citySlug,
  );
}

/** Get all cuisine slugs for static generation */
export function getAllCuisineSlugs(): string[] {
  return cuisines.map((c) => c.slug);
}

/** Get all city slugs for static generation */
export function getAllCitySlugs(): string[] {
  return cities.map((c) => c.slug);
}

/** Check if a slug matches an existing top-level route (collision guard) */
const RESERVED_ROUTES = new Set([
  'menu', 'about', 'reservations', 'contact', 'events', 'gallery',
  'blog', 'press', 'faq', 'gift-cards', 'careers', 'privacy', 'terms',
  'services', 'components-preview', 'admin',
]);

export function isReservedRoute(slug: string): boolean {
  return RESERVED_ROUTES.has(slug);
}
