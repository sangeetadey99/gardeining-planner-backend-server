const supabase = require("../config/supabaseClient");

exports.getTips = async (req, res, next) => {
  try {
    const currentMonth = new Date().getMonth();
    const seasonNames = ["winter", "spring", "summer", "fall"];
    const currentSeason = seasonNames[Math.floor(currentMonth / 3) % 4];

    const tips = [
      {
        id: 1,
        title: "Watering Best Practices",
        category: "watering",
        season: "all",
        content: "Water deeply but infrequently to encourage deep root growth. Early morning is the best time to water.",
        difficulty: "beginner",
      },
      {
        id: 2,
        title: "Soil Preparation",
        category: "soil",
        season: "spring",
        content: "Test your soil pH and amend with compost before planting. Good soil is the foundation of a healthy garden.",
        difficulty: "intermediate",
      },
      {
        id: 3,
        title: "Companion Planting",
        category: "planting",
        season: "spring",
        content: "Plant marigolds with tomatoes to deter pests. Basil near tomatoes can improve flavor and repel insects.",
        difficulty: "beginner",
      },
      {
        id: 4,
        title: "Pest Prevention",
        category: "pests",
        season: "summer",
        content: "Inspect plants regularly for early signs of pests. Remove affected leaves and use organic pest control methods first.",
        difficulty: "intermediate",
      },
      {
        id: 5,
        title: "Winter Garden Protection",
        category: "seasonal",
        season: "winter",
        content: "Apply mulch after the ground freezes to protect plant roots. Wrap sensitive trees to prevent frost damage.",
        difficulty: "intermediate",
      },
      {
        id: 6,
        title: "Container Gardening",
        category: "containers",
        season: "all",
        content: "Choose containers with drainage holes. Use potting mix specifically designed for containers, not garden soil.",
        difficulty: "beginner",
      },
      {
        id: 7,
        title: "Harvesting Techniques",
        category: "harvest",
        season: "summer",
        content: "Harvest vegetables in the morning when they're crisp. Use clean scissors or pruners to avoid damaging plants.",
        difficulty: "beginner",
      },
      {
        id: 8,
        title: "Seed Starting",
        category: "planting",
        season: "spring",
        content: "Start seeds 6-8 weeks before last frost. Use sterile seed starting mix and provide adequate light.",
        difficulty: "intermediate",
      },
    ];

    const seasonalTips = tips.filter(tip => tip.season === currentSeason || tip.season === "all");

    res.json({
      current_season: currentSeason,
      tips: seasonalTips,
    });
  } catch (error) {
    next(error);
  }
};

exports.getTipsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;

    const categoryTips = {
      watering: [
        "Check soil moisture before watering - stick your finger 2 inches deep",
        "Different plants have different water needs - group similar plants together",
        "Consider drip irrigation for consistent, efficient watering",
      ],
      soil: [
        "Add 2-3 inches of compost annually to improve soil structure",
        "Test soil pH every 2-3 years",
        "Avoid walking on garden soil when wet to prevent compaction",
      ],
      planting: [
        "Follow spacing recommendations on seed packets",
        "Plant taller plants on the north side of the garden",
        "Rotate crops annually to prevent soil-borne diseases",
      ],
      pests: [
        "Encourage beneficial insects with diverse plantings",
        "Use row covers to protect young plants from pests",
        "Practice good garden hygiene - remove diseased plant material",
      ],
      containers: [
        "Choose containers at least 12 inches deep for most vegetables",
        "Elevate containers to improve drainage",
        "Container plants need more frequent fertilizing than garden plants",
      ],
    };

    const tips = categoryTips[category] || [];

    res.json({
      category,
      tips,
    });
  } catch (error) {
    next(error);
  }
};

exports.getTipsByPlant = async (req, res, next) => {
  try {
    const { plantType } = req.params;

    const plantTips = {
      tomato: [
        "Plant deep - bury 2/3 of the stem for stronger root system",
        "Provide consistent support with cages or stakes",
        "Water at the base to avoid leaf diseases",
        "Remove suckers for larger, better-quality fruit",
      ],
      lettuce: [
        "Plant in partial shade in hot climates",
        "Harvest outer leaves first for continuous production",
        "Keep soil consistently moist for tender leaves",
        "Succession plant every 2 weeks for continuous harvest",
      ],
      herbs: [
        "Most herbs prefer full sun and well-drained soil",
        "Pinch back growing tips to encourage bushiness",
        "Harvest in the morning when essential oils are strongest",
        "Avoid fertilizing herbs - it can reduce flavor intensity",
      ],
      peppers: [
        "Warm soil is essential - wait until night temperatures stay above 60°F",
        "Provide consistent moisture to prevent blossom end rot",
        "Stake plants to support heavy fruit production",
        "Harvest regularly to encourage continued production",
      ],
    };

    const tips = plantTips[plantType.toLowerCase()] || [
      "Research specific care requirements for this plant type",
      "Monitor for pests and diseases regularly",
      "Provide appropriate sunlight and water conditions",
      "Fertilize according to plant needs and growth stage",
    ];

    res.json({
      plant_type: plantType,
      tips,
    });
  } catch (error) {
    next(error);
  }
};

exports.getResources = async (req, res, next) => {
  try {
    const resources = [
      {
        id: 1,
        title: "Beginner's Guide to Vegetable Gardening",
        type: "article",
        url: "https://example.com/vegetable-gardening-guide",
        category: "basics",
        difficulty: "beginner",
        description: "Comprehensive guide for starting your first vegetable garden",
      },
      {
        id: 2,
        title: "Organic Pest Control Methods",
        type: "video",
        url: "https://example.com/organic-pest-control",
        category: "pests",
        difficulty: "intermediate",
        description: "Learn natural ways to control garden pests",
      },
      {
        id: 3,
        title: "Composting 101",
        type: "article",
        url: "https://example.com/composting-guide",
        category: "soil",
        difficulty: "beginner",
        description: "Everything you need to know about home composting",
      },
      {
        id: 4,
        title: "Container Gardening Masterclass",
        type: "course",
        url: "https://example.com/container-gardening",
        category: "containers",
        difficulty: "intermediate",
        description: "Complete course on growing plants in containers",
      },
      {
        id: 5,
        title: "Plant Disease Identification",
        type: "tool",
        url: "https://example.com/disease-id",
        category: "health",
        difficulty: "advanced",
        description: "Interactive tool for identifying plant diseases",
      },
    ];

    res.json(resources);
  } catch (error) {
    next(error);
  }
};
