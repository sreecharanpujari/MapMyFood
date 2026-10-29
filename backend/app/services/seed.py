from sqlalchemy.orm import Session
from backend.app.models.models import City, Dish, Place, User
from backend.app.services.auth import hash_password

CITIES_DATA = [
    # South India
    {
        "name": "Hyderabad",
        "state": "Telangana",
        "region": "South",
        "latitude": 17.3850,
        "longitude": 78.4867,
        "description": "Known as the City of Pearls and Nizams, Hyderabad boasts an iconic culinary heritage that marries royal Persian, Turkish, and Mughal cooking techniques with fiery Telugu spices.",
        "banner_image": "https://images.unsplash.com/photo-1605335198126-7243c22b9c73?auto=format&fit=crop&w=1200&q=80",
        "is_sample": False
    },
    {
        "name": "Chennai",
        "state": "Tamil Nadu",
        "region": "South",
        "latitude": 13.0827,
        "longitude": 80.2707,
        "description": "The cultural capital of South India, celebrated for centuries-old vegetarian tiffin traditions, crisp fermented crepes, aromatic filter coffee, and intense Chettinad pepper gravies.",
        "banner_image": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
        "is_sample": False
    },
    {
        "name": "Kochi",
        "state": "Kerala",
        "region": "South",
        "latitude": 9.9312,
        "longitude": 76.2673,
        "description": "The Malabar spice coast port blending Syrian Christian, Hindu, and colonial influences into fragrant dishes brimming with fresh grated coconut, curry leaves, and black pepper.",
        "banner_image": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
        "is_sample": False
    },
    {
        "name": "Mangalore",
        "state": "Karnataka",
        "region": "South",
        "latitude": 12.9141,
        "longitude": 74.8560,
        "description": "The coastal jewel of Karnataka where Tuluva, Konkani, and Bunt culinary legacies converge around fiery red Byadagi chillies, pure ghee, coconut milks, and fresh ocean catch.",
        "banner_image": "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80",
        "is_sample": False
    },
    {
        "name": "Madurai",
        "state": "Tamil Nadu",
        "region": "South",
        "latitude": 9.9252,
        "longitude": 78.1198,
        "description": "The historic temple city famed as Tamil Nadu's late-night food capital, renowned for multi-layered tiffin dosas, spicy mutton curries, and the legendary cooling Jigarthanda beverage.",
        "banner_image": "https://images.unsplash.com/photo-1609137144822-bcfba58dcae0?auto=format&fit=crop&w=1200&q=80",
        "is_sample": False
    },

    # North India
    {
        "name": "Amritsar",
        "state": "Punjab",
        "region": "North",
        "latitude": 31.6340,
        "longitude": 74.8723,
        "description": "The spiritual heart of Punjab and a culinary powerhouse famous for golden tandoors, layered buttery breads, slow-cooked lentils, and unmatched street hospitality.",
        "banner_image": "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=1200&q=80",
        "is_sample": False
    },
    {
        "name": "Delhi",
        "state": "Delhi NCR",
        "region": "North",
        "latitude": 28.6139,
        "longitude": 77.2090,
        "description": "The historic capital spanning the walled alleys of Old Delhi and leafy avenues of New Delhi, legendary for Punjabi clay ovens, melt-in-mouth chaats, and rich curries.",
        "banner_image": "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80",
        "is_sample": False
    },
    {
        "name": "Lucknow",
        "state": "Uttar Pradesh",
        "region": "North",
        "latitude": 26.8467,
        "longitude": 80.9462,
        "description": "The epicenter of refined Awadhi culinary artistry, celebrated for slow 'dum pukht' braising, complex spice bouquets, and gossamer-soft kebabs designed for royalty.",
        "banner_image": "https://images.unsplash.com/photo-1609137144822-bcfba58dcae0?auto=format&fit=crop&w=1200&q=80",
        "is_sample": False
    },
    {
        "name": "Varanasi",
        "state": "Uttar Pradesh",
        "region": "North",
        "latitude": 25.3176,
        "longitude": 82.9739,
        "description": "One of the world's oldest living cities on the sacred ghats of the Ganga, renowned for its distinct satvik street snacks, spicy tomato chaat in earthen pots, and winter saffron milk foam.",
        "banner_image": "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80",
        "is_sample": False
    },
    {
        "name": "Srinagar",
        "state": "Jammu & Kashmir",
        "region": "North",
        "latitude": 34.0837,
        "longitude": 74.7973,
        "description": "Nestled in the Kashmir valley, home to the multi-course Wazwan feast, warming saffron brews, and mountain dishes fragrant with dried ginger, fennel, and Kashmiri mirch.",
        "banner_image": "https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1200&q=80",
        "is_sample": False
    },
    {
        "name": "Shimla",
        "state": "Himachal Pradesh",
        "region": "North",
        "latitude": 31.1048,
        "longitude": 77.1734,
        "description": "Set amid pine forests in the Western Himalayas, celebrated for Pahadi Dham community feasts, slow-simmered yogurt curries (Madra), and wholesome fermented steamed breads.",
        "banner_image": "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80",
        "is_sample": False
    },

    # East India
    {
        "name": "Kolkata",
        "state": "West Bengal",
        "region": "East",
        "latitude": 22.5726,
        "longitude": 88.3639,
        "description": "India's intellectual and gastronomic capital of the East, famous for Nizam-era street rolls, fragrant saffron-potato biryani, mustard-laced fish curries, and heavenly milk sweets.",
        "banner_image": "https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=1200&q=80",
        "is_sample": False
    },
    {
        "name": "Bhubaneswar",
        "state": "Odisha",
        "region": "East",
        "latitude": 20.2961,
        "longitude": 85.8245,
        "description": "The Temple City of Odisha with deep spiritual culinary traditions connected to the Jagannath Mahaprasad, known for slow-cooked lentil-vegetable Dalma and caramelized baked cottage cheese.",
        "banner_image": "https://images.unsplash.com/photo-1600100397608-f010f44331d5?auto=format&fit=crop&w=1200&q=80",
        "is_sample": False
    },
    {
        "name": "Patna",
        "state": "Bihar",
        "region": "East",
        "latitude": 25.5941,
        "longitude": 85.1376,
        "description": "The ancient seat of Magadha on the southern banks of the Ganga, proud home of the rustic clay-roasted Litti Chokha, aromatic sattu flour dishes, and crispy layered sweets.",
        "banner_image": "https://images.unsplash.com/photo-1590483256033-6cfc7a42ea22?auto=format&fit=crop&w=1200&q=80",
        "is_sample": False
    },

    # North-East India
    {
        "name": "Guwahati",
        "state": "Assam",
        "region": "North-East",
        "latitude": 26.1445,
        "longitude": 91.7362,
        "description": "The gateway to North-East India along the mighty Brahmaputra river, famous for subtle, aromatic cooking utilizing local greens, souring fruits, fragrant Kaji Nemu lemons, and freshwater fish.",
        "banner_image": "https://images.unsplash.com/photo-1628178129759-968e7ec8ff1c?auto=format&fit=crop&w=1200&q=80",
        "is_sample": False
    },
    {
        "name": "Shillong",
        "state": "Meghalaya",
        "region": "North-East",
        "latitude": 25.5788,
        "longitude": 91.8933,
        "description": "The pine-covered capital of Meghalaya and heart of Khasi indigenous cuisine, celebrated for wholesome highland red rice dishes, roasted black sesame seeds, and slow-braised meats.",
        "banner_image": "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=1200&q=80",
        "is_sample": False
    },
    {
        "name": "Kohima",
        "state": "Nagaland",
        "region": "North-East",
        "latitude": 25.6751,
        "longitude": 94.1086,
        "description": "Perched on mountain ridges in Nagaland, celebrated for its bold ancestral culinary identity based on wood-smoked meats, fermented soybeans (Akhuni), bamboo shoots, and fiery Bhut Jolokia chillies.",
        "banner_image": "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80",
        "is_sample": False
    },

    # West India
    {
        "name": "Mumbai",
        "state": "Maharashtra",
        "region": "West",
        "latitude": 19.0760,
        "longitude": 72.8777,
        "description": "The bustling financial hub where migrant cultures forged an energetic street food movement centered around toasted pav, zesty chutneys, and coastal Konkani delicacies.",
        "banner_image": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80",
        "is_sample": False
    },
    {
        "name": "Pune",
        "state": "Maharashtra",
        "region": "West",
        "latitude": 18.5204,
        "longitude": 73.8567,
        "description": "The cultural capital of Maharashtra, known for robust Marathi spice blends (Goda Masala), fiery sprouted moth bean misals, sweet puran polis, and historic tea-house snacking culture.",
        "banner_image": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80",
        "is_sample": False
    },
    {
        "name": "Jaipur",
        "state": "Rajasthan",
        "region": "West",
        "latitude": 26.9124,
        "longitude": 75.7873,
        "description": "The Pink City showcases desert royal feasts engineered for longevity and bold spice profiles, rich with clarified butter (ghee), lentils, and buttermilk breads.",
        "banner_image": "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80",
        "is_sample": False
    },
    {
        "name": "Ahmedabad",
        "state": "Gujarat",
        "region": "West",
        "latitude": 23.0225,
        "longitude": 72.5714,
        "description": "A UNESCO World Heritage city renowned for elaborate vegetarian thalis, balance of sweet-tangy seasonings, and an endlessly inventive snacking culture (farsan).",
        "banner_image": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80",
        "is_sample": False
    },
    {
        "name": "Surat",
        "state": "Gujarat",
        "region": "West",
        "latitude": 21.1702,
        "longitude": 72.8311,
        "description": "The historic trading port on the Tapi river with Gujarat's most celebrated street food culture; legendary for winter earthen pot casserole Undhiyu and fluffy spicy Locho.",
        "banner_image": "https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&w=1200&q=80",
        "is_sample": False
    },
    {
        "name": "Panaji",
        "state": "Goa",
        "region": "West",
        "latitude": 15.4909,
        "longitude": 73.8278,
        "description": "The sun-kissed Konkan coast where Portuguese maritime history meets indigenous Saraswat flavours, celebrated for fiery kokum-spiked fish curries and layered desserts.",
        "banner_image": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
        "is_sample": False
    },

    # Central India
    {
        "name": "Indore",
        "state": "Madhya Pradesh",
        "region": "Central",
        "latitude": 22.7196,
        "longitude": 75.8577,
        "description": "The culinary capital of central India and India's cleanest city, famous for its midnight Sarafa street food bazaar, fragrant spiced poha jalebi, and sweet corn delicacies.",
        "banner_image": "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=1200&q=80",
        "is_sample": False
    }
]

DISHES_DATA = [
    # Hyderabad
    {
        "name": "Hyderabadi Dum Biryani",
        "city_name": "Hyderabad",
        "state": "Telangana",
        "cuisine_type": "Hyderabadi / Awadhi",
        "category": "Main Course",
        "dietary": "Non-Vegetarian",
        "spice_level": "Spicy",
        "description": "A world-renowned celebratory dish consisting of long-grain basmati rice and tender spiced meat cooked together on slow heat ('dum') in a dough-sealed copper vessel.",
        "cultural_context": "Originated in the royal kitchens of the Asaf Jahi Nizams in the 18th century, blending Mughlai technique with the fiery chillies and souring agents of the Deccan plateau.",
        "key_ingredients": "Basmati rice, Marinated mutton or chicken, Saffron, Fried onions (birista), Mint, Ghee, Shahi jeera",
        "image_url": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
        "is_sample": False
    },
    {
        "name": "Mirchi Ka Salan",
        "city_name": "Hyderabad",
        "state": "Telangana",
        "cuisine_type": "Hyderabadi",
        "category": "Main Course",
        "dietary": "Vegetarian",
        "spice_level": "Spicy",
        "description": "A velvety, tangy, and nutty curry made with long green bhavnagri chillies simmered in a gravy of roasted peanuts, sesame seeds, tamarind, and coconut.",
        "cultural_context": "Traditionally served as the quintessential accompaniment to cut the richness of Hyderabadi biryani at wedding banquets.",
        "key_ingredients": "Large mild chillies, Peanuts, Sesame seeds, Grated coconut, Tamarind paste, Mustard seeds",
        "image_url": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80",
        "is_sample": False
    },
    {
        "name": "Double Ka Meetha",
        "city_name": "Hyderabad",
        "state": "Telangana",
        "cuisine_type": "Hyderabadi",
        "category": "Dessert",
        "dietary": "Vegetarian",
        "spice_level": "Mild",
        "description": "A luscious dessert crafted from crisp fried milk bread slices soaked in saffron-infused warm milk, sweetened syrup, and topped with clotted cream (rabri) and dry nuts.",
        "cultural_context": "A classic Nizami dessert named 'double roti' after the English milk loaf that puffs up double in size when soaked.",
        "key_ingredients": "Milk bread, Rabri, Condensed milk, Saffron, Green cardamom, Silver vark, Pistachios",
        "image_url": "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80",
        "is_sample": False
    },

    # Chennai
    {
        "name": "Masala Dosa",
        "city_name": "Chennai",
        "state": "Tamil Nadu",
        "cuisine_type": "South Indian",
        "category": "Breakfast",
        "dietary": "Vegetarian",
        "spice_level": "Medium",
        "description": "A paper-thin, crispy fermented rice and black gram crepe roasted golden in ghee, folded gently around a warmly spiced mustard-tempered potato masala.",
        "cultural_context": "An integral everyday breakfast staple across Tamil Nadu and South India, served on fresh banana leaves with aromatic sambar and fresh coconut chutneys.",
        "key_ingredients": "Fermented parboiled rice batter, Urad dal, Boiled potatoes, Mustard seeds, Curry leaves, Green chillies, Ghee",
        "image_url": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
        "is_sample": False
    },
    {
        "name": "Chettinad Pepper Chicken",
        "city_name": "Chennai",
        "state": "Tamil Nadu",
        "cuisine_type": "Chettinad",
        "category": "Main Course",
        "dietary": "Non-Vegetarian",
        "spice_level": "Extra Spicy",
        "description": "A robust, deeply flavorful chicken curry from the mercantile Chettiar community, built upon dry-roasted whole peppercorns, star anise, kalpasi (stone flower), and shallots.",
        "cultural_context": "The Chettiars were historic maritime traders who brought exotic spices across Southeast Asia, resulting in one of the most aromatic spice repertoires in India.",
        "key_ingredients": "Country chicken, Tellicherry black pepper, Kalpasi (stone flower), Small shallots, Star anise, Curry leaves, Fennel seeds",
        "image_url": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80",
        "is_sample": False
    },
    {
        "name": "Madras Filter Coffee",
        "city_name": "Chennai",
        "state": "Tamil Nadu",
        "cuisine_type": "South Indian",
        "category": "Beverage",
        "dietary": "Vegetarian",
        "spice_level": "Mild",
        "description": "Frothed sweet milk blended with a dark decoction brewed in a traditional brass drip filter using roasted chicory and coffee beans, served in a stainless steel 'dabarah' and tumbler.",
        "cultural_context": "A sacred morning ritual in Chennai, poured back and forth from great heights to achieve a natural creamy froth without machine steaming.",
        "key_ingredients": "Dark roast coffee powder, Chicory blend, Full cream milk, Cane sugar",
        "image_url": "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80",
        "is_sample": False
    },

    # Mangalore
    {
        "name": "Chicken Ghee Roast",
        "city_name": "Mangalore",
        "state": "Karnataka",
        "cuisine_type": "Coastal Karnataka / Mangalorean",
        "category": "Main Course",
        "dietary": "Non-Vegetarian",
        "spice_level": "Spicy",
        "description": "Tender chicken marinated in yogurt and spices, slow-roasted in pure clarified butter (ghee) with an intense red ground paste of whole Byadagi chillies, coriander, and peppercorns.",
        "cultural_context": "Created in the small town of Kundapura near Mangalore in the late 1950s, this dish represents the pinnacle of coastal Karnataka's lavish ghee-based pan roasting.",
        "key_ingredients": "Chicken, Pure desi ghee, Whole Byadagi chillies, Curd, Fenugreek, Tamarind, Peppercorns",
        "image_url": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80",
        "is_sample": False
    },
    {
        "name": "Neer Dosa",
        "city_name": "Mangalore",
        "state": "Karnataka",
        "cuisine_type": "Coastal Karnataka",
        "category": "Breakfast",
        "dietary": "Vegetarian",
        "spice_level": "Mild",
        "description": "Delicate, lace-like, paper-thin crepes prepared from unfermented runny rice batter and water, served hot with coconut chutney, sagu, or spicy chicken curry.",
        "cultural_context": "A hallmark of Tuluva Mangalorean heritage; 'Neer' translates directly to 'Water', referring to the very watery batter poured over hot cast-iron skillets without spreading.",
        "key_ingredients": "Short grain rice soaked and ground fine, Grated coconut, Water, Salt",
        "image_url": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
        "is_sample": False
    },

    # Madurai
    {
        "name": "Madurai Famous Jigarthanda",
        "city_name": "Madurai",
        "state": "Tamil Nadu",
        "cuisine_type": "Tamil / Royal Cooling",
        "category": "Beverage",
        "dietary": "Vegetarian",
        "spice_level": "Mild",
        "description": "A legendary dessert beverage meaning 'Heart Coolant', prepared with almond gum resin (badam pisin), nannari sarsaparilla syrup, caramelized reduced milk (basundi), and hand-churned ice cream.",
        "cultural_context": "Brought to Madurai during the Mughal/Nawab era and preserved by Muslim settling families, traditionally drunk on searing summer evenings in temple lanes.",
        "key_ingredients": "Badam pisin (almond gum resin), Nannari root syrup, Caramelized reduced milk, Fresh full cream milk, Vanilla ice cream",
        "image_url": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
        "is_sample": False
    },
    {
        "name": "Madurai Kari Dosa",
        "city_name": "Madurai",
        "state": "Tamil Nadu",
        "cuisine_type": "Tamil Street",
        "category": "Main Course",
        "dietary": "Non-Vegetarian",
        "spice_level": "Spicy",
        "description": "A three-tiered skillet masterpiece: thick fermented dosa batter topped with a beaten egg omelette layer and crowned with fiery minced mutton keema chukka.",
        "cultural_context": "Born in Madurai's bustling late-night street food joints, famous for heavy working-class fuel after night temple festivals.",
        "key_ingredients": "Dosa batter, Minced mutton keema, Whisked eggs, Shallots, Fennel powder, Curry leaves, Black pepper",
        "image_url": "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80",
        "is_sample": False
    },

    # Amritsar
    {
        "name": "Amritsari Kulcha",
        "city_name": "Amritsar",
        "state": "Punjab",
        "cuisine_type": "Punjabi",
        "category": "Breakfast",
        "dietary": "Vegetarian",
        "spice_level": "Medium",
        "description": "A crisp, multi-layered leavened flatbread stuffed with spiced potatoes, onions, or paneer, slapped inside a searing coal tandoor and crushed by hand with a dollop of white butter.",
        "cultural_context": "Rooted in Amritsar's communal culinary spirit, traditionally devoured alongside piquant chole (chickpeas) and tangy sliced onion-tamarind chutney.",
        "key_ingredients": "Refined flour dough, Spiced mashed potatoes, Pomegranate seeds (anardana), Ajwain, White butter (makhan), Coriander",
        "image_url": "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80",
        "is_sample": False
    },
    {
        "name": "Makki Di Roti & Sarson Da Saag",
        "city_name": "Amritsar",
        "state": "Punjab",
        "cuisine_type": "Punjabi",
        "category": "Main Course",
        "dietary": "Vegetarian",
        "spice_level": "Medium",
        "description": "A comforting winter masterpiece pairing slow-simmered mustard and spinach greens with rustic unleavened maize flatbreads and fresh jaggery.",
        "cultural_context": "A celebration of Punjab's pastoral agrarian heartland, cooked for hours in earthen pots over woodfire during the cold harvesting months.",
        "key_ingredients": "Sarson leaves (mustard greens), Bathua, Spinach, Maize flour (makki atta), Ginger, Garlic, White butter, Jaggery",
        "image_url": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
        "is_sample": False
    },
    {
        "name": "Amritsari Lassi",
        "city_name": "Amritsar",
        "state": "Punjab",
        "cuisine_type": "Punjabi",
        "category": "Beverage",
        "dietary": "Vegetarian",
        "spice_level": "Mild",
        "description": "A thick, velvety churned curd drink poured into tall clay glasses and topped with a thick slab of fresh clotted cream (malai) and cardamom essence.",
        "cultural_context": "Served from mammoth brass churners across Amritsar's historic gates, celebrated as an energizing everyday refreshment.",
        "key_ingredients": "Cultured whole milk yogurt, Sugar, Cardamom, Thick clotted cream (malai)",
        "image_url": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
        "is_sample": False
    },

    # Kolkata
    {
        "name": "Kathi Roll",
        "city_name": "Kolkata",
        "state": "West Bengal",
        "cuisine_type": "Bengali / Street Food",
        "category": "Street Food",
        "dietary": "Non-Vegetarian",
        "spice_level": "Medium",
        "description": "Charcoal-grilled skewered meat wrapped inside a flaky, flaky layered paratha lined with a whisked fried egg, raw sliced onions, green chillies, and a squeeze of fresh lime.",
        "cultural_context": "Invented at Nizam's in Kolkata during the 1930s to offer busy British colonial officials and office babus a tidy, portable way to eat kebabs on the go.",
        "key_ingredients": "Layered paratha, Skewered marinated chicken or mutton, Egg layer, Red onions, Green chillies, Chat masala, Lime juice",
        "image_url": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80",
        "is_sample": False
    },
    {
        "name": "Kolkata Biryani",
        "city_name": "Kolkata",
        "state": "West Bengal",
        "cuisine_type": "Awadhi-Bengali",
        "category": "Main Course",
        "dietary": "Non-Vegetarian",
        "spice_level": "Medium",
        "description": "A subtly fragrant, saffron-stained basmati rice preparation distinguished by large, succulent slow-cooked potatoes and boiled eggs along with tender mutton.",
        "cultural_context": "Created when the exiled Nawab of Awadh, Wajid Ali Shah, settled in Metiabruz, Kolkata in 1856; royal cooks introduced potatoes to absorb meat juices gracefully.",
        "key_ingredients": "Basmati rice, Marinated mutton, Saffron, Fried potatoes, Boiled eggs, Meetha ittar, Kewra water",
        "image_url": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
        "is_sample": False
    },
    {
        "name": "Rosogolla & Mishti Doi",
        "city_name": "Kolkata",
        "state": "West Bengal",
        "cuisine_type": "Bengali",
        "category": "Dessert",
        "dietary": "Vegetarian",
        "spice_level": "Mild",
        "description": "Spongy, porous cottage cheese balls boiled in light sugar syrup paired with silky caramelized fermented sweetened yogurt set in porous earthen cups.",
        "cultural_context": "The pinnacle of Bengal's celebrated confectionery craftsmanship, popularized by confectioner Nobin Chandra Das in 1868.",
        "key_ingredients": "Fresh chhena (cottage cheese), Sugar syrup, Caramelized reduced milk, Yogurt cultures, Cardamom",
        "image_url": "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80",
        "is_sample": False
    },

    # Odisha / Bhubaneswar
    {
        "name": "Odia Dalma",
        "city_name": "Bhubaneswar",
        "state": "Odisha",
        "cuisine_type": "Odia Temple",
        "category": "Main Course",
        "dietary": "Vegetarian",
        "spice_level": "Mild",
        "description": "A nutritious, aromatic one-pot stew of toor dal cooked with raw banana, pumpkin, eggplant, and colocasia, tempered in pure ghee with five-spice (panch phoron) and roasted cumin-chilli powder.",
        "cultural_context": "A central component of the centuries-old Mahaprasad sacred offerings at the Jagannath Temple in Puri, avoiding onion and garlic entirely.",
        "key_ingredients": "Toor dal, Raw banana, Pumpkin, Panch phoron (five spices), Desi ghee, Roasted cumin powder, Grated coconut",
        "image_url": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
        "is_sample": False
    },
    {
        "name": "Chhena Poda",
        "city_name": "Bhubaneswar",
        "state": "Odisha",
        "cuisine_type": "Odia Confectionery",
        "category": "Dessert",
        "dietary": "Vegetarian",
        "spice_level": "Mild",
        "description": "India's indigenous baked cheesecake: fresh soft cottage cheese kneaded with sugar, cardamom, and semolina, wrapped in sal leaves and slow-baked over smoldering coals until a caramelized brown crust forms.",
        "cultural_context": "Invented accidentally in Nayagarh, Odisha in the 1930s by confectioner Sudarsan Sahu, who left sweetened chhena in a warm chulha oven overnight.",
        "key_ingredients": "Fresh chhena (cow milk curd), Sugar, Semolina, Cardamom powder, Desi ghee, Cashew nuts",
        "image_url": "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80",
        "is_sample": False
    },

    # Bihar / Patna
    {
        "name": "Bihari Litti Chokha",
        "city_name": "Patna",
        "state": "Bihar",
        "cuisine_type": "Bihari",
        "category": "Main Course",
        "dietary": "Vegetarian",
        "spice_level": "Medium",
        "description": "Hard-crusted whole wheat dough spheres stuffed with roasted gram flour (sattu) spiced with carom seeds and pickled mango masala, roasted directly on cow dung embers and drenched in hot melted desi ghee.",
        "cultural_context": "Ancient staple of the Magadh kingdom and an enduring survival food for soldiers due to sattu's long shelf life and high nutritional density.",
        "key_ingredients": "Whole wheat flour, Sattu (roasted black gram flour), Ajwain, Kalonji, Mustard oil, Desi ghee, Roasted eggplant, Tomatoes",
        "image_url": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
        "is_sample": False
    },

    # Assam / Guwahati
    {
        "name": "Assamese Masor Tenga",
        "city_name": "Guwahati",
        "state": "Assam",
        "cuisine_type": "Assamese",
        "category": "Main Course",
        "dietary": "Non-Vegetarian",
        "spice_level": "Mild",
        "description": "A light, refreshing sour fish broth cooked with fresh freshwater carp (Rohu), seasoned delicately with mustard seeds and souring agents like elephant apple (ou tenga) or native Kaji Nemu lemons.",
        "cultural_context": "The quintessential summer afternoon staple across Assam, designed to revitalize the body in the humid subtropical Brahmaputra river plains.",
        "key_ingredients": "Fresh river Rohu fish, Kaji Nemu lemon juice or Ou Tenga (elephant apple), Tomatoes, Mustard oil, Fenugreek seeds, Turmeric",
        "image_url": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
        "is_sample": False
    },

    # Meghalaya / Shillong
    {
        "name": "Khasi Jadoh",
        "city_name": "Shillong",
        "state": "Meghalaya",
        "cuisine_type": "Khasi / Meghalayan",
        "category": "Main Course",
        "dietary": "Non-Vegetarian",
        "spice_level": "Medium",
        "description": "A cherished Khasi celebration rice dish cooked in fragrant meat broth with local hill red rice, seasoned with ginger, turmeric, bay leaves, and slow-braised pork chunks.",
        "cultural_context": "The festive culinary cornerstone of indigenous Khasi harvest celebrations and traditional markets across the Khasi and Jaintia hills.",
        "key_ingredients": "Jyntep indigenous hill red rice, Pork chunks, Ginger-garlic paste, Turmeric, Bay leaves, Black pepper",
        "image_url": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
        "is_sample": False
    },

    # Nagaland / Kohima
    {
        "name": "Naga Smoked Pork with Akhuni",
        "city_name": "Kohima",
        "state": "Nagaland",
        "cuisine_type": "Naga Tribal",
        "category": "Main Course",
        "dietary": "Non-Vegetarian",
        "spice_level": "Extra Spicy",
        "description": "Woodsmoke-cured pork braised with deeply umami fermented soybean paste (Akhuni), fiery Ghost Pepper (Bhut Jolokia), and sun-dried tomatoes without oil.",
        "cultural_context": "Smoked over open hearths in Naga hill homes, Akhuni fermentation represents centuries of indigenous food preservation techniques in rainforest terrain.",
        "key_ingredients": "Wood-smoked pork belly, Akhuni (fermented soybeans), Bhut Jolokia (Ghost chillies), Ginger, Garlic, Local herbs",
        "image_url": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        "is_sample": False
    },

    # Mumbai
    {
        "name": "Mumbai Vada Pav",
        "city_name": "Mumbai",
        "state": "Maharashtra",
        "cuisine_type": "Maharashtrian",
        "category": "Street Food",
        "dietary": "Vegetarian",
        "spice_level": "Spicy",
        "description": "The quintessential Mumbai street burger: a golden spiced potato fritter encased in a soft baker's bun, slathered with fiery dry garlic-coconut chutney and fried salted green chillies.",
        "cultural_context": "Invented in 1966 outside Dadar railway station by Ashok Vaidya as an affordable, hearty meal for mill workers navigating Mumbai's commuter rush.",
        "key_ingredients": "Mashed spiced potatoes, Chickpea batter (besan), Pav bread, Dry garlic chutney, Green coriander chutney, Green chillies",
        "image_url": "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80",
        "is_sample": False
    },
    {
        "name": "Pav Bhaji",
        "city_name": "Mumbai",
        "state": "Maharashtra",
        "cuisine_type": "Maharashtrian",
        "category": "Street Food",
        "dietary": "Vegetarian",
        "spice_level": "Medium",
        "description": "A thick, spicy mash of mixed seasonal vegetables simmered with tomatoes and special spices on a giant cast-iron tawa, served with warm, butter-drenched griddled pav.",
        "cultural_context": "Originated during the American Civil War boom of the 1860s to feed cotton traders who worked late night hours waiting for telegraph quotes.",
        "key_ingredients": "Potatoes, Green peas, Cauliflower, Tomatoes, Pav bhaji masala, Butter, Fresh cilantro, Lemon",
        "image_url": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80",
        "is_sample": False
    },

    # Pune
    {
        "name": "Puneri Misal Pav",
        "city_name": "Pune",
        "state": "Maharashtra",
        "cuisine_type": "Maharashtrian",
        "category": "Breakfast",
        "dietary": "Vegetarian",
        "spice_level": "Extra Spicy",
        "description": "Sprouted moth beans cooked with aromatic spices, topped with crunchy farsan, chopped onions, and lemon, drenched in a blistering red spicy gravy known as 'Tarri' or 'Kat'.",
        "cultural_context": "The crown jewel of Maharashtrian breakfast culture, fiercely debated across regions from Pune to Kolhapur and Nashik.",
        "key_ingredients": "Sprouted moth beans (matki), Goda masala, Red chilli oil (tarri/kat), Farsan mix, Pav, Onions, Coriander",
        "image_url": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80",
        "is_sample": False
    },

    # Delhi
    {
        "name": "Chole Bhature",
        "city_name": "Delhi",
        "state": "Delhi NCR",
        "cuisine_type": "North Indian",
        "category": "Breakfast",
        "dietary": "Vegetarian",
        "spice_level": "Spicy",
        "description": "Balloon-like, golden-fried leavened sourdough bread accompanied by dark, spicy, tangy chickpea curry cooked with dried black tea leaves and whole spices.",
        "cultural_context": "A legendary Delhi indulgence embraced across the capital after partition, accompanied by sour amla pickles, pickled carrots, and green chillies.",
        "key_ingredients": "Kabuli chana (chickpeas), Fermented refined flour, Anardana (pomegranate seed), Black tea brew, Garam masala, Pickled onions",
        "image_url": "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80",
        "is_sample": False
    },
    {
        "name": "Butter Chicken (Murgh Makhani)",
        "city_name": "Delhi",
        "state": "Delhi NCR",
        "cuisine_type": "North Indian / Mughlai",
        "category": "Main Course",
        "dietary": "Non-Vegetarian",
        "spice_level": "Medium",
        "description": "Tender tandoor-roasted chicken pieces gently bathed in a velvety sauce of ripe tomatoes, butter, cashew paste, and aromatic dried fenugreek leaves (kasoori methi).",
        "cultural_context": "Created in 1950s Daryaganj, Delhi by Kundan Lal Gujral at Moti Mahal to keep leftover tandoori chicken moist and juicy.",
        "key_ingredients": "Tandoori chicken, Ripe tomatoes, Clarified butter, Heavy cream, Cashew paste, Kasoori methi",
        "image_url": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80",
        "is_sample": False
    },

    # Lucknow
    {
        "name": "Galouti Kebab",
        "city_name": "Lucknow",
        "state": "Uttar Pradesh",
        "cuisine_type": "Awadhi",
        "category": "Main Course",
        "dietary": "Non-Vegetarian",
        "spice_level": "Medium",
        "description": "An unbelievably tender minced meat kebab crafted with raw papaya tenderizer and over 100 exotic aromatic spices, shallow fried in ghee on a mahi tawa.",
        "cultural_context": "Specially invented by royal Awadhi bawarchis for the aging Nawab Asad-ud-Daula who had lost his teeth but refused to give up his passion for kebabs.",
        "key_ingredients": "Finely minced lamb, Raw green papaya, Roasted gram flour, Mace, Cardamom, Ghee, Saffron",
        "image_url": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        "is_sample": False
    },

    # Varanasi
    {
        "name": "Banarasi Tamatar Chaat",
        "city_name": "Varanasi",
        "state": "Uttar Pradesh",
        "cuisine_type": "Banarasi Street",
        "category": "Street Food",
        "dietary": "Vegetarian",
        "spice_level": "Medium",
        "description": "A unique, steaming savory chaat of mashed ripe tomatoes, potatoes, and peas slow-cooked with hing and ginger, drenched in roasted cumin sugar syrup and served in earthen clay kulhads.",
        "cultural_context": "Exclusive to the narrow ghat alleys of Kashi, this chaat achieves the sublime Indian balance of sour, sweet, hot, and smoky in a terracotta vessel.",
        "key_ingredients": "Ripe country tomatoes, Boiled potatoes, Green peas, Hing (asafoetida), Roasted cumin sugar syrup, Namakpara crisps",
        "image_url": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80",
        "is_sample": False
    },
    {
        "name": "Banarasi Malaiyo",
        "city_name": "Varanasi",
        "state": "Uttar Pradesh",
        "cuisine_type": "Banarasi Confectionery",
        "category": "Dessert",
        "dietary": "Vegetarian",
        "spice_level": "Mild",
        "description": "An ethereal winter dessert made by churning sweetened milk left overnight in the winter morning dew, yielding a cloud of saffron-cardamom scented foam topped with pistachios.",
        "cultural_context": "Prepared exclusively during chilly winter dawns in the Chowk and Thatheri Bazaar alleys of Old Varanasi.",
        "key_ingredients": "Raw cow milk, Winter dew exposure, Saffron strands, Green cardamom, Crushed pistachios, Almond slivers",
        "image_url": "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80",
        "is_sample": False
    },

    # Indore
    {
        "name": "Indori Poha Jalebi",
        "city_name": "Indore",
        "state": "Madhya Pradesh",
        "cuisine_type": "Malwi / Central Indian",
        "category": "Breakfast",
        "dietary": "Vegetarian",
        "spice_level": "Medium",
        "description": "Steamed flattened rice infused with turmeric and fennel, dusted generously with signature Jeeravan masala and crunchy Ratlami sev, paired with piping hot crispy saffron jalebis.",
        "cultural_context": "The sacred daily morning addiction of Indore, celebrated by Holkar royals and mill workers alike on Chhappan Dukan street.",
        "key_ingredients": "Flattened rice (poha), Fennel seeds, Jeeravan spice blend, Ratlami laung sev, Fresh pomegranate pearls, Saffron jalebi",
        "image_url": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
        "is_sample": False
    },
    {
        "name": "Bhutte Ka Kees",
        "city_name": "Indore",
        "state": "Madhya Pradesh",
        "cuisine_type": "Malwi",
        "category": "Street Food",
        "dietary": "Vegetarian",
        "spice_level": "Mild",
        "description": "Grated tender local sweet corn slow-simmered in milk with mustard seeds, green chillies, and ginger, garnished with fresh grated coconut and coriander.",
        "cultural_context": "A historic specialty of the Malwa plateau, born from local corn harvests and popularized in Indore's midnight Sarafa bazaar.",
        "key_ingredients": "Fresh tender sweet corn, Full cream milk, Mustard seeds, Green chillies, Grated coconut, Lemon juice",
        "image_url": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
        "is_sample": False
    },

    # Jaipur
    {
        "name": "Dal Baati Churma",
        "city_name": "Jaipur",
        "state": "Rajasthan",
        "cuisine_type": "Rajasthani",
        "category": "Main Course",
        "dietary": "Vegetarian",
        "spice_level": "Medium",
        "description": "The quintessential three-in-one Rajasthani feast: hard baked wheat dumplings cracked open and submerged in pure ghee, served with spicy five-lentil curry and sweet crushed wheat churma.",
        "cultural_context": "Developed during medieval Rajput war expeditions when baatis were buried under hot desert sands at sunrise and retrieved baked by evening.",
        "key_ingredients": "Whole wheat flour, Panchmel dal (5 lentils), Pure desi ghee, Jaggery, Green cardamom, Cloves",
        "image_url": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
        "is_sample": False
    },

    # Ahmedabad & Surat
    {
        "name": "Khaman Dhokla",
        "city_name": "Ahmedabad",
        "state": "Gujarat",
        "cuisine_type": "Gujarati",
        "category": "Snack",
        "dietary": "Vegetarian",
        "spice_level": "Mild",
        "description": "Light, sponge-like steamed savory cakes made from freshly ground gram flour, tempered with crackling mustard seeds, curry leaves, and green chillies with a gentle hint of sweetness.",
        "cultural_context": "A hallmark of Gujarati culinary precision and health consciousness, balancing steaming techniques with vibrant tempering.",
        "key_ingredients": "Gram flour (besan), Fruit salt, Mustard seeds, Curry leaves, Green chillies, Fresh coconut shreds, Coriander",
        "image_url": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
        "is_sample": False
    },
    {
        "name": "Surti Undhiyu",
        "city_name": "Surat",
        "state": "Gujarat",
        "cuisine_type": "Gujarati Winter",
        "category": "Main Course",
        "dietary": "Vegetarian",
        "spice_level": "Medium",
        "description": "A complex Gujarati winter casserole cooked with fresh green beans (surti papdi), baby eggplants, purple yams, sweet potatoes, and spiced fenugreek dumplings (muthiya).",
        "cultural_context": "Traditionally prepared in an earthen pot ('matka') sealed with leaves and buried upside down in an earthen pit fired with dry dung ('undhu' means inverted).",
        "key_ingredients": "Surti papdi (flat beans), Purple yam (kand), Fenugreek dumplings (muthiya), Green garlic, Grated coconut, Peanuts, Ajwain",
        "image_url": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
        "is_sample": False
    },

    # Kochi
    {
        "name": "Karimeen Pollichathu",
        "city_name": "Kochi",
        "state": "Kerala",
        "cuisine_type": "Kerala Coastal",
        "category": "Main Course",
        "dietary": "Non-Vegetarian",
        "spice_level": "Spicy",
        "description": "Fresh backwater pearl spot fish marinated in a rich paste of shallots, ginger, garlic, and fiery Malabar spices, wrapped delicately in a charred banana leaf and slow-roasted on a tawa.",
        "cultural_context": "An emblematic jewel of the Kerala backwaters and toddy-shack culinary culture, where the charred banana leaf infuses deep smoky earthiness.",
        "key_ingredients": "Karimeen (pearl spot fish), Shallots, Kudampuli (Malabar tamarind), Ginger, Garlic, Curry leaves, Coconut oil, Banana leaf",
        "image_url": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
        "is_sample": False
    },

    # Srinagar
    {
        "name": "Kashmiri Rogan Josh",
        "city_name": "Srinagar",
        "state": "Jammu & Kashmir",
        "cuisine_type": "Kashmiri Wazwan",
        "category": "Main Course",
        "dietary": "Non-Vegetarian",
        "spice_level": "Medium",
        "description": "An aristocratic Persian-influenced curry featuring tender mutton braised in an intensely red, aromatic gravy flavored with Kashmiri chillies, dried ginger, and fennel.",
        "cultural_context": "The crowning centerpiece of the formal 36-course Kashmiri Wazwan feast, cooked in nickel-coated copper vessels over woodfire.",
        "key_ingredients": "Mutton on bone, Kashmiri red chillies, Fennel seed powder, Dried ginger (sonth), Asafoetida, Mustard oil, Ratan jot",
        "image_url": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        "is_sample": False
    },

    # Shimla / Himachal
    {
        "name": "Himachali Chana Madra",
        "city_name": "Shimla",
        "state": "Himachal Pradesh",
        "cuisine_type": "Pahadi / Himachali Dham",
        "category": "Main Course",
        "dietary": "Vegetarian",
        "spice_level": "Mild",
        "description": "White chickpeas or kidney beans slow-simmered in a rich, velvety spiced yogurt gravy flavored with green cardamom, cloves, cinnamon, and dry raisins.",
        "cultural_context": "The defining dish of the traditional Himachali community feast known as 'Dham', prepared exclusively by hereditary Brahmin cooks called 'Botis'.",
        "key_ingredients": "Kabuli chana (chickpeas), Cultured yogurt, Desi ghee, Green cardamom, Cloves, Dried raisins, Turmeric",
        "image_url": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
        "is_sample": False
    },

    # Goa
    {
        "name": "Goan Fish Curry",
        "city_name": "Panaji",
        "state": "Goa",
        "cuisine_type": "Goan / Konkani",
        "category": "Main Course",
        "dietary": "Non-Vegetarian",
        "spice_level": "Medium",
        "description": "A vibrant golden-orange coastal curry made with fresh kingfish or pomfret simmered in freshly ground coconut milk, spiced with Kashmiri chillies and soured with tart kokum rind.",
        "cultural_context": "The lifeblood of Goan daily meals, traditionally savored with steaming unpolished Goan red rice (ukda rice).",
        "key_ingredients": "Fresh kingfish/surmai, Grated coconut, Kokum rinds, Kashmiri chillies, Coriander seeds, Garlic, Turmeric",
        "image_url": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
        "is_sample": False
    }
]

SAMPLE_PLACES = [
    {
        "city_name": "Hyderabad",
        "dish_name": "Hyderabadi Dum Biryani",
        "name": "Sample Spot: Old City Heritage Biryani House",
        "address": "Near Charminar Precinct, Hyderabad (Sample Location)",
        "latitude": 17.3616,
        "longitude": 78.4747,
        "price_range": "Moderate",
        "notes": "Illustrative sample listing for showcasing UI. No live restaurant partnership implied."
    },
    {
        "city_name": "Chennai",
        "dish_name": "Masala Dosa",
        "name": "Sample Spot: Mylapore Heritage Tiffin Room",
        "address": "Kapaleeshwarar Temple Area, Chennai (Sample Location)",
        "latitude": 13.0336,
        "longitude": 80.2690,
        "price_range": "Budget",
        "notes": "Illustrative sample listing for showcasing UI. No live restaurant partnership implied."
    },
    {
        "city_name": "Mangalore",
        "dish_name": "Chicken Ghee Roast",
        "name": "Sample Spot: Coastal Hearth Ghee Roast Kitchen",
        "address": "Bunder Wharf Road, Mangalore (Sample Location)",
        "latitude": 12.8620,
        "longitude": 74.8380,
        "price_range": "Moderate",
        "notes": "Illustrative sample listing for showcasing UI. No live restaurant partnership implied."
    },
    {
        "city_name": "Madurai",
        "dish_name": "Madurai Famous Jigarthanda",
        "name": "Sample Spot: East Marret Street Jigarthanda Stall",
        "address": "Near Meenakshi Amman East Gate, Madurai (Sample Location)",
        "latitude": 9.9190,
        "longitude": 78.1215,
        "price_range": "Budget",
        "notes": "Illustrative sample listing for showcasing UI. No live restaurant partnership implied."
    },
    {
        "city_name": "Amritsar",
        "dish_name": "Amritsari Kulcha",
        "name": "Sample Spot: Golden Heritage Kulcha Point",
        "address": "Heritage Street, Near Golden Temple, Amritsar (Sample Location)",
        "latitude": 31.6200,
        "longitude": 74.8765,
        "price_range": "Budget",
        "notes": "Illustrative sample listing for showcasing UI. No live restaurant partnership implied."
    },
    {
        "city_name": "Kolkata",
        "dish_name": "Kathi Roll",
        "name": "Sample Spot: New Market Roll Kiosk",
        "address": "Lindsay Street, New Market, Kolkata (Sample Location)",
        "latitude": 22.5601,
        "longitude": 88.3512,
        "price_range": "Budget",
        "notes": "Illustrative sample listing for showcasing UI. No live restaurant partnership implied."
    },
    {
        "city_name": "Bhubaneswar",
        "dish_name": "Odia Dalma",
        "name": "Sample Spot: Ekamra Temple Dalma Rasoi",
        "address": "Old Town Temple Precinct, Bhubaneswar (Sample Location)",
        "latitude": 20.2405,
        "longitude": 85.8340,
        "price_range": "Budget",
        "notes": "Illustrative sample listing for showcasing UI. No live restaurant partnership implied."
    },
    {
        "city_name": "Patna",
        "dish_name": "Bihari Litti Chokha",
        "name": "Sample Spot: Maurya Lok Sattu Hub",
        "address": "Dak Bungalow Crossing, Patna (Sample Location)",
        "latitude": 25.6100,
        "longitude": 85.1380,
        "price_range": "Budget",
        "notes": "Illustrative sample listing for showcasing UI. No live restaurant partnership implied."
    },
    {
        "city_name": "Guwahati",
        "dish_name": "Assamese Masor Tenga",
        "name": "Sample Spot: Brahmaputra Riverbank Kitchen",
        "address": "Uzanbazar Ghat Road, Guwahati (Sample Location)",
        "latitude": 26.1900,
        "longitude": 91.7500,
        "price_range": "Moderate",
        "notes": "Illustrative sample listing for showcasing UI. No live restaurant partnership implied."
    },
    {
        "city_name": "Shillong",
        "dish_name": "Khasi Jadoh",
        "name": "Sample Spot: Iewduh Heritage Stall",
        "address": "Bara Bazaar (Iewduh), Shillong (Sample Location)",
        "latitude": 25.5750,
        "longitude": 91.8820,
        "price_range": "Budget",
        "notes": "Illustrative sample listing for showcasing UI. No live restaurant partnership implied."
    },
    {
        "city_name": "Kohima",
        "dish_name": "Naga Smoked Pork with Akhuni",
        "name": "Sample Spot: Kisama Heritage Hearth",
        "address": "Naga Heritage Village Precinct, Kohima (Sample Location)",
        "latitude": 25.6400,
        "longitude": 94.1050,
        "price_range": "Moderate",
        "notes": "Illustrative sample listing for showcasing UI. No live restaurant partnership implied."
    },
    {
        "city_name": "Varanasi",
        "dish_name": "Banarasi Tamatar Chaat",
        "name": "Sample Spot: Dashashwamedh Chaat Corner",
        "address": "Dashashwamedh Ghat Road, Varanasi (Sample Location)",
        "latitude": 25.3080,
        "longitude": 83.0090,
        "price_range": "Budget",
        "notes": "Illustrative sample listing for showcasing UI. No live restaurant partnership implied."
    },
    {
        "city_name": "Indore",
        "dish_name": "Indori Poha Jalebi",
        "name": "Sample Spot: Chhappan Dukan Poha Corner",
        "address": "New Palasia, Chhappan Dukan, Indore (Sample Location)",
        "latitude": 22.7240,
        "longitude": 75.8840,
        "price_range": "Budget",
        "notes": "Illustrative sample listing for showcasing UI. No live restaurant partnership implied."
    }
]

def seed_database(db: Session, force_refresh: bool = False):
    """Seed initial cities, dishes, and sample places if empty or on refresh."""
    existing_city_count = db.query(City).count()
    if existing_city_count >= len(CITIES_DATA) and not force_refresh:
        return

    print("Seeding database with expanded pan-Indian regional culinary data...")

    # Clear existing if force refresh
    if force_refresh:
        db.query(Place).delete()
        db.query(Dish).delete()
        db.query(City).delete()
        db.commit()

    city_map = {}
    for c_data in CITIES_DATA:
        existing = db.query(City).filter(City.name == c_data["name"]).first()
        if not existing:
            city = City(**c_data)
            db.add(city)
            db.flush()
            city_map[city.name] = city
        else:
            city_map[existing.name] = existing

    for d_data in DISHES_DATA:
        city_name = d_data.get("city_name")
        dish_name = d_data.get("name")
        city = city_map.get(city_name)
        if city:
            existing_dish = db.query(Dish).filter(Dish.name == dish_name).first()
            if not existing_dish:
                d_copy = d_data.copy()
                d_copy.pop("city_name")
                dish = Dish(**d_copy, city_id=city.id)
                db.add(dish)
                db.flush()

    for p_data in SAMPLE_PLACES:
        city_name = p_data.get("city_name")
        dish_name = p_data.get("dish_name")
        place_name = p_data.get("name")
        city = city_map.get(city_name)
        dish = db.query(Dish).filter(Dish.name == dish_name).first() if dish_name else None
        if city:
            existing_place = db.query(Place).filter(Place.name == place_name).first()
            if not existing_place:
                p_copy = p_data.copy()
                p_copy.pop("city_name")
                p_copy.pop("dish_name")
                place = Place(
                    **p_copy,
                    city_id=city.id,
                    dish_id=dish.id if dish else None,
                    is_sample=True
                )
                db.add(place)

    # Demo test user
    demo_user = db.query(User).filter(User.email == "explorer@mapmyfood.in").first()
    if not demo_user:
        demo_user = User(
            email="explorer@mapmyfood.in",
            full_name="Spice Explorer",
            hashed_password=hash_password("password123")
        )
        db.add(demo_user)

    db.commit()
    print("Database seeding completed with expanded pan-Indian dataset!")
