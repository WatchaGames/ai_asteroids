const sectorDescriptions = {
    "sector_1": {"name": "Andromeda", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_2": {"name": "Antlia", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_3": {"name": "Apus", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_4": {"name": "Aquarius", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_5": {"name": "Aquila", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_6": {"name": "Ara", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."}  ,
    "sector_7": {"name": "Aries", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_8": {"name": "Auriga", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_9": {"name": "Bootes", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_10": {"name": "Caelum", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_11": {"name": "Camelopardalis", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."}, 
    "sector_12": {"name": "Cancer", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_13": {"name": "Canes Venatici", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_14": {"name": "Canis Major", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_15": {"name": "Canis Minor", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_16": {"name": "Capricornus", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_17": {"name": "Carina", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_18": {"name": "Cassiopeia", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_19": {"name": "Centaurus", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_20": {"name": "Cepheus", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_21": {"name": "Cetus", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_22": {"name": "Chamaeleon", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_23": {"name": "Circinus", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_24": {"name": "Columba", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_25": {"name": "Coma Berenices", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_26": {"name": "Corona Australis", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_27": {"name": "Corona Borealis", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_28": {"name": "Corvus", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_29": {"name": "Crater", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_30": {"name": "Crux", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_31": {"name": "Cygnus", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_32": {"name": "Delphinus", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_33": {"name": "Dorado", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_34": {"name": "Draco", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_35": {"name": "Equuleus", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_36": {"name": "Eridanus", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_37": {"name": "Fornax", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_38": {"name": "Gemini", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_39": {"name": "Grus", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_40": {"name": "Hercules", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_41": {"name": "Horologium", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_42": {"name": "Hydra", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_43": {"name": "Hydrus", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_44": {"name": "Indus", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_45": {"name": "Lacerta", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_46": {"name": "Leo", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_47": {"name": "Leo Minor", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_48": {"name": "Lepus", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_49": {"name": "Libra", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_50": {"name": "Lupus", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_51": {"name": "Lynx", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_52": {"name": "Lyra", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_53": {"name": "Mensa", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_54": {"name": "Microscopium", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_55": {"name": "Monoceros", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_56": {"name": "Musca", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_57": {"name": "Norma", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_58": {"name": "Octans", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_59": {"name": "Ophiuchus", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_60": {"name": "Orion", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."}   ,
    "sector_61": {"name": "Pavo", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_62": {"name": "Pegasus", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},    
    "sector_63": {"name": "Perseus", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},    
    "sector_64": {"name": "Phoenix", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},        
    "sector_65": {"name": "Pictor", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."}, 
    "sector_66": {"name": "Pisces", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_67": {"name": "Piscis Austrinus", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_68": {"name": "Puppis", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_69": {"name": "Pyxis", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_70": {"name": "Reticulum", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_71": {"name": "Sagitta", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_72": {"name": "Sagittarius", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_73": {"name": "Scorpius", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_74": {"name": "Sculptor", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_75": {"name": "Scutum", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_76": {"name": "Serpens", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_77": {"name": "Sextans", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_78": {"name": "Taurus", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_79": {"name": "Telescopium", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_80": {"name": "Triangulum", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_81": {"name": "Triangulum Australe", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_82": {"name": "Tucana", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_83": {"name": "Ursa Major", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_84": {"name": "Ursa Minor", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."}  ,
    "sector_85": {"name": "Vela", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_86": {"name": "Virgo", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_87": {"name": "Volans", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_88": {"name": "Vulpecula", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_89": {"name": "Sirius", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_90": {"name": "Canopus", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_91": {"name": "Arcturus", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_92": {"name": "Vega", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_93": {"name": "Capella", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_94": {"name": "Rigel", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_95": {"name": "Procyon", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_96": {"name": "Achernar", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_97": {"name": "Betelgeuse", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_98": {"name": "Hadar", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_99": {"name": "Altair", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."},
    "sector_100": {"name": "Antares", "asteroids": 100, "bonuses": 10, "description": "A dense cluster of stars and galaxies, known for its spiral arms and active star formation."}
}

export function GetSectorNameByIndex(index) {
    // Convert wave index to sector number (1-based)
    const sectorNumber = (index % 100) + 1;
    const sectorKey = `sector_${sectorNumber}`;
    if (sectorDescriptions[sectorKey]) {
        return sectorDescriptions[sectorKey].name;
    }
    return "Unknown Sector";
}

export function GetSectorDescriptionByIndex(index){
    const sectorNumber = (index % 100) + 1;
    const sectorKey = `sector_${sectorNumber}`;
    if (sectorDescriptions[sectorKey]) {
        return sectorDescriptions[sectorKey];
    }
    return null;
}

export { sectorDescriptions as sectorNames };
