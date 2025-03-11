const sectorDescriptions = {
    "sector_1": {"name": "Andromeda", "nbAsteroids": 4, "acConfig": "ac_regular_only", 	"bonuses": 0.3, "description": "TODO"},
    "sector_2": {"name": "Antlia", "nbAsteroids": 6, "acConfig": "ac_regular_only", "bonuses": 0.3, "description": "TODO"},
    "sector_3": {"name": "Apus", "nbAsteroids": 8, "acConfig": "ac_regular_only", "bonuses": 1.0, "description": "TODO"},
    "sector_4": {"name": "Aquarius", "nbAsteroids": 10, "acConfig": "ac_regular_only", "bonuses": 10, "description": "TODO"},
    "sector_5": {"name": "Aquila", "nbAsteroids": 12, "acConfig": "ac_regular_only", "bonuses": 1.0 , "description": "TODO"},
    "sector_6": {"name": "Ara", "nbAsteroids": 14, "acConfig": "ac_regular_only", "bonuses": 1.0, "description": "TODO"}  ,
    "sector_7": {"name": "Aries", "nbAsteroids": 16, "acConfig": "ac_regular_only", "bonuses": 1.0, "description": "TODO"},
    "sector_8": {"name": "Auriga", "nbAsteroids": 18, "acConfig": "ac_regular_only", "bonuses": 1.0, "description": "TODO"},
    "sector_9": {"name": "Bootes", "nbAsteroids": 22, "acConfig": "ac_regular_only", "bonuses": 1.0, "description": "TODO"},
    "sector_10": {"name": "Caelum", "nbAsteroids": 26, "acConfig": "ac_regular_only", "bonuses": 1.0, "description": "TODO"},
    "sector_11": {"name": "Camelopardalis", "nbAsteroids": 30, "acConfig": "ac_regular_only", "bonuses": 1.0, "description": "TODO"}, 
    "sector_12": {"name": "Cancer", "nbAsteroids": 34, "acConfig": "ac_regular_only", "bonuses": 1.0, "description": "TODO"},
    "sector_13": {"name": "Canes Venatici", "nbAsteroids": 40, "acConfig": "ac_regular_only", "bonuses": 1.0, "description": "TODO"},
    "sector_14": {"name": "Canis Major", "nbAsteroids": 44, "acConfig": "ac_regular_only", "bonuses": 1.0, "description": "TODO"},
    "sector_15": {"name": "Canis Minor", "nbAsteroids": 50, "acConfig": "ac_regular_only", "bonuses": 1.0, "description": "TODO"},
    "sector_16": {"name": "Capricornus", "nbAsteroids": 60, "acConfig": "ac_regular_only", "bonuses": 1.0, "description": "TODO"},
    "sector_17": {"name": "Carina", "nbAsteroids": 62, "acConfig": "ac_regular_only", "bonuses": 1.0, "description": "TODO"},
    "sector_18": {"name": "Cassiopeia", "nbAsteroids": 64, "acConfig": "ac_regular_only", "bonuses": 1.0, "description": "TODO"},
    "sector_19": {"name": "Centaurus", "nbAsteroids": 66, "acConfig": "ac_regular_only", "bonuses": 1.0, "description": "TODO"},
    "sector_20": {"name": "Cepheus", "nbAsteroids": 70, "acConfig": "ac_regular_only", "bonuses": 1.0, "description": "TODO"},
    
    "sector_21": {"name": "Cetus", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_22": {"name": "Chamaeleon", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_23": {"name": "Circinus", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_24": {"name": "Columba", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_25": {"name": "Coma Berenices", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_26": {"name": "Corona Australis", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_27": {"name": "Corona Borealis", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_28": {"name": "Corvus", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_29": {"name": "Crater", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_30": {"name": "Crux", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_31": {"name": "Cygnus", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_32": {"name": "Delphinus", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_33": {"name": "Dorado", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_34": {"name": "Draco", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_35": {"name": "Equuleus", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_36": {"name": "Eridanus", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_37": {"name": "Fornax", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_38": {"name": "Gemini", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_39": {"name": "Grus", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_40": {"name": "Hercules", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_41": {"name": "Horologium", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_42": {"name": "Hydra", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_43": {"name": "Hydrus", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_44": {"name": "Indus", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_45": {"name": "Lacerta", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_46": {"name": "Leo", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_47": {"name": "Leo Minor", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_48": {"name": "Lepus", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_49": {"name": "Libra", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_50": {"name": "Lupus", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_51": {"name": "Lynx", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_52": {"name": "Lyra", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_53": {"name": "Mensa", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_54": {"name": "Microscopium", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_55": {"name": "Monoceros", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_56": {"name": "Musca", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_57": {"name": "Norma", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_58": {"name": "Octans", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_59": {"name": "Ophiuchus", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_60": {"name": "Orion", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"}   ,
    "sector_61": {"name": "Pavo", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_62": {"name": "Pegasus", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},    
    "sector_63": {"name": "Perseus", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},    
    "sector_64": {"name": "Phoenix", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},        
    "sector_65": {"name": "Pictor", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"}, 
    "sector_66": {"name": "Pisces", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_67": {"name": "Piscis Austrinus", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_68": {"name": "Puppis", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_69": {"name": "Pyxis", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_70": {"name": "Reticulum", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_71": {"name": "Sagitta", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_72": {"name": "Sagittarius", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_73": {"name": "Scorpius", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_74": {"name": "Sculptor", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_75": {"name": "Scutum", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_76": {"name": "Serpens", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_77": {"name": "Sextans", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_78": {"name": "Taurus", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_79": {"name": "Telescopium", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_80": {"name": "Triangulum", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_81": {"name": "Triangulum Australe", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_82": {"name": "Tucana", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_83": {"name": "Ursa Major", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_84": {"name": "Ursa Minor", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"}  ,
    "sector_85": {"name": "Vela", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_86": {"name": "Virgo", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_87": {"name": "Volans", "asternbAsteroidsoids": 100, "bonuses": 10, "description": "TODO"},
    "sector_88": {"name": "Vulpecula", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_89": {"name": "Sirius", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_90": {"name": "Canopus", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_91": {"name": "Arcturus", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_92": {"name": "Vega", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_93": {"name": "Capella", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_94": {"name": "Rigel", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_95": {"name": "Procyon", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_96": {"name": "Achernar", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_97": {"name": "Betelgeuse", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_98": {"name": "Hadar", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_99": {"name": "Altair", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"},
    "sector_100": {"name": "Antares", "nbAsteroids": 100, "bonuses": 10, "description": "TODO"}
}


const asteroidsConfigs = {
    "ac_regular_only": { speedMultiplier: 1, probabilities: { straight: 0.5, orbiting: 0.0 , aiming: 0.0} },
    "ac_orbiting_only": { speedMultiplier: 1, probabilities: { straight: 0.0, orbiting: 0.5 , aiming: 0.0} },
    "ac_aiming_only": { speedMultiplier: 1, probabilities: { straight: 0.0, orbiting: 0.0 , aiming: 0.5} },
    "ac_fast_regular_only": { speedMultiplier: 2, probabilities: { straight: 0.5, orbiting: 0.0 , aiming: 0.0} },
    "ac_fast_orbiting_only": { speedMultiplier: 2, probabilities: { straight: 0.0, orbiting: 0.5 , aiming: 0.0} },
    "ac_fast_aiming_only": { speedMultiplier: 2, probabilities: { straight: 0.0, orbiting: 0.0 , aiming: 0.5} },
}


export function GetSectorNameByIndex(index) {
    const sectorNumber = (index % 100);
    const sectorKey = `sector_${sectorNumber}`;
    if (sectorDescriptions[sectorKey]) {
        return sectorDescriptions[sectorKey].name;
    }
    return "Unknown Sector";
}

export function GetSectorDescriptionByIndex(index){
    const sectorNumber = (index % 100);
    const sectorKey = `sector_${sectorNumber}`;
    if (sectorDescriptions[sectorKey]) {
        return sectorDescriptions[sectorKey];
    }
    return null;
}

export function GetSectorAsteroidSize(sectorDescription,sizeName){
    if(sizeName == 'large') {return 30; }
    else if(sizeName == 'medium') {return 15; }
    else if(sizeName == 'small') {return 7.5; }
    else if(sizeName == 'indestructible') {return 40; }
    return 30;
}

export function GetSectorAsteroidSpeed(sectorDescription,sizeName){
    if(sizeName == 'large') {return 2; }
    else if(sizeName == 'medium') {return 3; }
    else if(sizeName == 'small') {return 4; }
    return 2;
}


function GetAsteroidsConfig(sectorDescription){
    const configName = sectorDescription.acConfig;
    const config = asteroidsConfigs[configName];
    if(config) {return config; }
}


// returns infos on asteroid to spawn for this sector
// returns sizeName, speed, type (straight, orbiting, aiming)
export function GetAsteroidToSpawnInfo(sectorDescription,inSizeName){
    let ret = {
        sizeName: inSizeName,
        speed: 2,
        type: 'straight'
    }
    const config = GetAsteroidsConfig(sectorDescription);
    const probabilities = config.probabilities;
    const random = Math.random();
    if(random < probabilities.straight) {ret.type = 'straight'; }
    else if(random < probabilities.orbiting) {ret.type = 'orbiting'; }
    else {ret.type = 'aiming'; }
    ret.speed = GetSectorAsteroidSpeed(sectorDescription,ret.sizeName) * config.speedMultiplier;
    return ret;
}

// Generation of asteroids dependeing on the sector configuration

export { sectorDescriptions as sectorNames };
