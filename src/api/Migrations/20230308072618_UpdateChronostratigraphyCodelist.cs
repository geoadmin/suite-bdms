﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BDMS.Migrations;

public partial class UpdateChronostratigraphyCodelist : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql(@"
CREATE TEMP TABLE new_chrono(
    geolcode int NOT NULL PRIMARY KEY,
    text_cli_en varchar,
    text_cli_de varchar,
    text_cli_fr varchar,
    text_cli_it varchar,
    order_cli int,
    conf_cli json,
    path_cli ltree
);

INSERT INTO new_chrono(geolcode, text_cli_en, text_cli_de, text_cli_fr, text_cli_it, order_cli, conf_cli, path_cli)
VALUES
    (15001001, 'Phanerozoic', 'Phanerozoikum', 'Phanérozoïque', 'Fanerozoico', 1, '{""color"":[154,217,221]}', '15001001'),
    (15001002, 'Cenozoic', 'Känozoikum', 'Cénozoïque', 'Cenozoico', 2, '{""color"":[242,249,29]}', '15001001.15001002'),
    (15001003, 'Quaternary', 'Quartär', 'Quaternaire', 'Quaternario', 3, '{""color"":[249,249,127]}', '15001001.15001002.15001003'),
    (15001004, 'Holocene', 'Holozän', 'Holocène', 'Olocene', 4, '{""color"":[254,235,210]}', '15001001.15001002.15001003.15001004'),
    (15001005, 'Pleistocene', 'Pleistozän', 'Pléistocène', 'Pleistocene', 5, '{""color"":[255,239,175]}', '15001001.15001002.15001003.15001005'),
    (15001006, 'Late Pleistocene', 'Spätes Pleistozän', 'Pléistocène tardif', 'Tardo Pleistocene', 6, '{""color"":[255,242,211]}', '15001001.15001002.15001003.15001005.15001006'),
    (15001007, 'Middle Pleistocene', 'Mittleres Pleistozän', 'Pléistocène moyen', 'Pleistocene Medio', 7, '{""color"":[255,242,199]}', '15001001.15001002.15001003.15001005.15001007'),
    (15001151, 'Chibanian', 'Chibanien', 'Chibanien', 'Chibaniano', 8, '{""color"":[255,242,199]}', '15001001.15001002.15001003.15001005.15001007.15001151'),
    (15001009, 'Early Pleistocene', 'Frühes Pleistozän', 'Pléistocène précoce', 'Primo Pleistocene', 9, '{""color"":[255,240,185]}', '15001001.15001002.15001003.15001005.15001009'),
    (15001010, 'Calabrian', 'Calabrien', 'Calabrien', 'Calabriano', 10, '{""color"":[255,242,186]}', '15001001.15001002.15001003.15001005.15001009.15001010'),
    (15001011, 'Gelasian', 'Gélasien', 'Gélasien', 'Gelasiano', 11, '{""color"":[255,237,179]}', '15001001.15001002.15001003.15001005.15001009.15001011'),
    (15001013, 'Neogene', 'Neogen', 'Néogène', 'Neogene', 13, '{""color"":[255,230,25]}', '15001001.15001002.15001013'),
    (15001014, 'Pliocene', 'Pliozän', 'Pliocène', 'Pliocene', 14, '{""color"":[255,255,153]}', '15001001.15001002.15001013.15001014'),
    (15001015, 'Piacenzian', 'Plaisancien', 'Plaisancien', 'Piacenziano', 15, '{""color"":[255,255,191]}', '15001001.15001002.15001013.15001014.0.15001015'),
    (15001016, 'Zanclean', 'Zancléen', 'Zancléen', 'Zancleano', 16, '{""color"":[255,255,179]}', '15001001.15001002.15001013.15001014.0.15001016'),
    (15001017, 'Miocene', 'Miozän', 'Miocène', 'Miocene', 17, '{""color"":[255,255,0]}', '15001001.15001002.15001013.15001017'),
    (15001018, 'Late Miocene', 'Spätes Miozän', 'Miocène tardif', 'Tardo Miocene', 18, '{""color"":[255,236,140]}', '15001001.15001002.15001013.15001017.15001018'),
    (15001019, 'Messinian', 'Messinien', 'Messinien', 'Messiniano', 19, '{""color"":[255,255,115]}', '15001001.15001002.15001013.15001017.15001018.15001019'),
    (15001020, 'Tortonian', 'Tortonien', 'Tortonien', 'Tortoniano', 20, '{""color"":[255,255,102]}', '15001001.15001002.15001013.15001017.15001018.15001020'),
    (15001021, 'Middle Miocene', 'Mittleres Miozän', 'Miocène moyen', 'Miocene Medio', 21, '{""color"":[255,236,115]}', '15001001.15001002.15001013.15001017.15001021'),
    (15001022, 'Serravallian', 'Serravallien', 'Serravallien', 'Serravalliano', 22, '{""color"":[255,255,89]}', '15001001.15001002.15001013.15001017.15001021.15001022'),
    (15001023, 'Langhian', 'Langhien', 'Langhien', 'Langhiano', 23, '{""color"":[255,255,77]}', '15001001.15001002.15001013.15001017.15001021.15001023'),
    (15001024, 'Early Miocene', 'Frühes Miozän', 'Miocène précoce', 'Primo Miocene', 24, '{""color"":[255,236,85]}', '15001001.15001002.15001013.15001017.15001024'),
    (15001025, 'Burdigalian', 'Burdigalien', 'Burdigalien', 'Burdigaliano', 25, '{""color"":[255,255,65]}', '15001001.15001002.15001013.15001017.15001024.15001025'),
    (15001026, 'late Burdigalian', 'spätes Burdigalien', 'Burdigalien tardif', 'tardo Burdigaliano', 26, '{""color"":[255,255,65]}', '15001001.15001002.15001013.15001017.15001024.15001025.15001026'),
    (15001027, 'early Burdigalian', 'frühes Burdigalien', 'Burdigalien précoce', 'primo Burdigaliano', 27, '{""color"":[255,255,65]}', '15001001.15001002.15001013.15001017.15001024.15001025.15001027'),
    (15001028, 'Aquitanian', 'Aquitanien', 'Aquitanien', 'Aquitaniano', 28, '{""color"":[255,255,51]}', '15001001.15001002.15001013.15001017.15001024.15001028'),
    (15001029, 'Paleogene', 'Paläogen', 'Paléogène', 'Paleogene', 29, '{""color"":[253,154,82]}', '15001001.15001002.15001029'),
    (15001030, 'Oligocene', 'Oligozän', 'Oligocène', 'Oligocene', 30, '{""color"":[254,192,122]}', '15001001.15001002.15001029.15001030'),
    (15001031, 'Chattian', 'Chattien', 'Chattien', 'Chattiano', 31, '{""color"":[254,230,170]}', '15001001.15001002.15001029.15001030.0.15001031'),
    (15001032, 'late Chattian', 'spätes Chattien', 'Chattien tardif', 'tardo Chattiano', 32, '{""color"":[254,230,170]}', '15001001.15001002.15001029.15001030.0.15001031.15001032'),
    (15001033, 'early Chattian', 'frühes Chattien', 'Chattien précoce', 'primo Chattiano', 33, '{""color"":[254,230,170]}', '15001001.15001002.15001029.15001030.0.15001031.15001033'),
    (15001034, 'Rupelian', 'Rupélien', 'Rupélien', 'Rupeliano', 34, '{""color"":[254,217,154]}', '15001001.15001002.15001029.15001030.0.15001034'),
    (15001035, 'Eocene', 'Eozän', 'Eocène', 'Eocene', 35, '{""color"":[253,180,108]}', '15001001.15001002.15001029.15001035'),
    (15001036, 'late Eocene', 'spätes Eozän', 'Eocène tardif', 'tardo Eocene', 36, '{""color"":[253,180,108]}', '15001001.15001002.15001029.15001035.15001036'),
    (15001037, 'Priabonian', 'Priabonien', 'Priabonien', 'Priaboniano', 37, '{""color"":[253,205,161]}', '15001001.15001002.15001029.15001035.15001036.15001037'),
    (15001038, 'late Priabonian', 'spätes Priabonien', 'Priabonien tardif / Latdorfien', 'tardo Priaboniano / Latdorfiano', 38, '{""color"":[253,205,161]}', '15001001.15001002.15001029.15001035.15001036.15001037.15001038'),
    (15001039, 'early Priabonian', 'frühes Priabonien', 'Priabonien précoce', 'primo Priaboniano', 39, '{""color"":[253,205,161]}', '15001001.15001002.15001029.15001035.15001036.15001037.15001039'),
    (15001040, 'middle Eocene', 'mittleres Eozän', 'Eocène moyen', 'Eocene medio', 40, '{""color"":[253,180,108]}', '15001001.15001002.15001029.15001035.15001040'),
    (15001041, 'Bartonian', 'Bartonien', 'Bartonien', 'Bartoniano', 41, '{""color"":[253,192,145]}', '15001001.15001002.15001029.15001035.15001040.15001041'),
    (15001042, 'Lutetian', 'Lutétien', 'Lutétien', 'Luteziano', 42, '{""color"":[253,180,130]}', '15001001.15001002.15001029.15001035.15001040.15001042'),
    (15001043, 'early Eocene', 'frühes Eozän', 'Eocène précoce', 'primo Eocene', 43, '{""color"":[253,180,108]}', '15001001.15001002.15001029.15001035.15001043'),
    (15001044, 'Ypresian', 'Yprésien', 'Yprésien', 'Ypresiano', 44, '{""color"":[252,167,115]}', '15001001.15001002.15001029.15001035.15001043.15001044'),
    (15001045, 'Paleocene', 'Paleozän', 'Paléocène', 'Paleocene', 45, '{""color"":[253,167,95]}', '15001001.15001002.15001029.15001045'),
    (15001046, 'Thanetian', 'Thanétien', 'Thanétien', 'Thanetiano', 46, '{""color"":[253,191,111]}', '15001001.15001002.15001029.15001045.0.15001046'),
    (15001047, 'Selandian', 'Sélandien', 'Sélandien', 'Selandiano', 47, '{""color"":[254,191,101]}', '15001001.15001002.15001029.15001045.0.15001047'),
    (15001048, 'Danian', 'Danien', 'Danien', 'Daniano', 48, '{""color"":[253,180,98]}', '15001001.15001002.15001029.15001045.0.15001048'),
    (15001049, 'Mesozoic', 'Mesozoikum', 'Mésozoïque', 'Mesozoico', 49, '{""color"":[103,197,202]}', '15001001.15001049'),
    (15001050, 'Cretaceous', 'Kreide', 'Crétacé', 'Cretaceo', 50, '{""color"":[127,198,78]}', '15001001.15001049.15001050'),
    (15001051, 'Late Cretaceous', 'Späte Kreide', 'Crétacé tardif', 'Tardo Cretaceo', 51, '{""color"":[166,216,74]}', '15001001.15001049.15001050.15001051'),
    (15001052, 'Maastrichtian', 'Maastrichtien', 'Maastrichtien', 'Maastrichtiano', 52, '{""color"":[242,250,140]}', '15001001.15001049.15001050.15001051.0.15001052'),
    (15001053, 'Campanian', 'Campanien', 'Campanien', 'Campaniano', 53, '{""color"":[230,244,127]}', '15001001.15001049.15001050.15001051.0.15001053'),
    (15001054, 'Santonian', 'Santonien', 'Santonien', 'Santoniano', 54, '{""color"":[217,239,116]}', '15001001.15001049.15001050.15001051.0.15001054'),
    (15001055, 'Coniacian', 'Coniacien', 'Coniacien', 'Coniaciano', 55, '{""color"":[204,233,104]}', '15001001.15001049.15001050.15001051.0.15001055'),
    (15001056, 'Turonian', 'Turonien', 'Turonien', 'Turoniano', 56, '{""color"":[191,227,93]}', '15001001.15001049.15001050.15001051.0.15001056'),
    (15001057, 'Cenomanian', 'Cénomanien', 'Cénomanien', 'Cenomaniano', 57, '{""color"":[179,222,83]}', '15001001.15001049.15001050.15001051.0.15001057'),
    (15001058, 'Early Cretaceous', 'Frühe Kreide', 'Crétacé précoce', 'Primo Cretaceo', 58, '{""color"":[140,205,87]}', '15001001.15001049.15001050.15001058'),
    (15001059, 'Albian', 'Albien', 'Albien', 'Albiano', 59, '{""color"":[204,234,151]}', '15001001.15001049.15001050.15001058.0.15001059'),
    (15001060, 'Aptian', 'Aptien', 'Aptien', 'Aptiano', 60, '{""color"":[191,228,138]}', '15001001.15001049.15001050.15001058.0.15001060'),
    (15001061, 'Barremian', 'Barrémien', 'Barrémien', 'Barremiano', 61, '{""color"":[179,223,127]}', '15001001.15001049.15001050.15001058.0.15001061'),
    (15001062, 'Hauterivian', 'Hauterivien', 'Hauterivien', 'Hauteriviano', 62, '{""color"":[166,217,117]}', '15001001.15001049.15001050.15001058.0.15001062'),
    (15001063, 'Valanginian', 'Valanginien', 'Valanginien', 'Valanginiano', 63, '{""color"":[153,211,106]}', '15001001.15001049.15001050.15001058.0.15001063'),
    (15001064, 'Berriasian', 'Berriasien', 'Berriasien', 'Berriasiano', 64, '{""color"":[140,205,96]}', '15001001.15001049.15001050.15001058.0.15001064'),
    (15001065, 'Jurassic', 'Jura', 'Jurassique', 'Giurassico', 65, '{""color"":[52,178,201]}', '15001001.15001049.15001065'),
    (15001066, 'Late Jurassic', 'Später Jura', 'Jurassique tardif', 'Tardo Giurassico', 66, '{""color"":[179,227,238]}', '15001001.15001049.15001065.15001066'),
    (15001067, 'Tithonian', 'Tithonien', 'Tithonien', 'Titoniano', 67, '{""color"":[217,241,247]}', '15001001.15001049.15001065.15001066.0.15001067'),
    (15001068, 'Kimmeridgian', 'Kimméridgien', 'Kimméridgien', 'Kimmeridgiano', 68, '{""color"":[204,236,244]}', '15001001.15001049.15001065.15001066.0.15001068'),
    (15001069, 'Oxfordian', 'Oxfordien', 'Oxfordien', 'Oxfordiano', 69, '{""color"":[191,231,241]}', '15001001.15001049.15001065.15001066.0.15001069'),
    (15001070, 'Middle Jurassic', 'Mittlerer Jura', 'Jurassique moyen', 'Giurassico Medio', 70, '{""color"":[128,207,216]}', '15001001.15001049.15001065.15001070'),
    (15001071, 'Callovian', 'Callovien', 'Callovien', 'Calloviano', 71, '{""color"":[191,231,229]}', '15001001.15001049.15001065.15001070.0.15001071'),
    (15001072, 'Bathonian', 'Bathonien', 'Bathonien', 'Bathoniano', 72, '{""color"":[179,226,227]}', '15001001.15001049.15001065.15001070.0.15001072'),
    (15001073, 'Bajocian', 'Bajocien', 'Bajocien', 'Bajociano', 73, '{""color"":[166,221,224]}', '15001001.15001049.15001065.15001070.0.15001073'),
    (15001074, 'Aalenian', 'Aalénien', 'Aalénien', 'Aaleniano', 74, '{""color"":[154,217,221]}', '15001001.15001049.15001065.15001070.0.15001074'),
    (15001075, 'Early Jurassic', 'Früher Jura', 'Jurassique précoce', 'Primo Giurassico', 75, '{""color"":[66,174,208]}', '15001001.15001049.15001065.15001075'),
    (15001076, 'Toarcian', 'Toarcien', 'Toarcien', 'Toarciano', 76, '{""color"":[153,206,227]}', '15001001.15001049.15001065.15001075.0.15001076'),
    (15001077, 'Pliensbachian', 'Pliensbachien', 'Pliensbachien', 'Pliensbachiano', 77, '{""color"":[128,197,221]}', '15001001.15001049.15001065.15001075.0.15001077'),
    (15001078, 'Sinemurian', 'Sinémurien', 'Sinémurien', 'Sinemuriano', 78, '{""color"":[103,188,216]}', '15001001.15001049.15001065.15001075.0.15001078'),
    (15001079, 'Hettangian', 'Hettangien', 'Hettangien', 'Hettangiano', 79, '{""color"":[78,179,211]}', '15001001.15001049.15001065.15001075.0.15001079'),
    (15001080, 'Triassic', 'Trias', 'Trias', 'Triassico', 80, '{""color"":[129,43,146]}', '15001001.15001049.15001080'),
    (15001081, 'Late Triassic', 'Späte Trias', 'Trias tardif', 'Tardo Triassico', 81, '{""color"":[189,140,195]}', '15001001.15001049.15001080.15001081'),
    (15001082, 'Rhaetian', 'Rhät', 'Rhétien', 'Retico', 82, '{""color"":[227,185,219]}', '15001001.15001049.15001080.15001081.0.15001082'),
    (15001083, 'Norian', 'Norien', 'Norien', 'Norico', 83, '{""color"":[214,170,211]}', '15001001.15001049.15001080.15001081.0.15001083'),
    (15001084, 'Carnian', 'Carnien', 'Carnien', 'Carnico', 84, '{""color"":[201,155,203]}', '15001001.15001049.15001080.15001081.0.15001084'),
    (15001085, 'Middle Triassic', 'Mittlere Trias', 'Trias moyen', 'Triassico Medio', 85, '{""color"":[177,104,177]}', '15001001.15001049.15001080.15001085'),
    (15001086, 'Ladinian', 'Ladinien', 'Ladinien', 'Ladinico', 86, '{""color"":[201,131,191]}', '15001001.15001049.15001080.15001085.0.15001086'),
    (15001087, 'Anisian', 'Anisien', 'Anisien', 'Anisico', 87, '{""color"":[188,117,183]}', '15001001.15001049.15001080.15001085.0.15001087'),
    (15001088, 'Early Triassic', 'Frühe Trias', 'Trias précoce', 'Primo Triassico', 88, '{""color"":[152,57,153]}', '15001001.15001049.15001080.15001088'),
    (15001089, 'Olenekian', 'Olénékien', 'Olénékien', 'Olenekiano', 89, '{""color"":[176,81,165]}', '15001001.15001049.15001080.15001088.0.15001089'),
    (15001090, 'Induan', 'Indusien', 'Indusien', 'Induano', 90, '{""color"":[164,70,159]}', '15001001.15001049.15001080.15001088.0.15001090'),
    (15001091, 'Paleozoic', 'Paläozoikum', 'Paléozoïque', 'Paleozoico', 91, '{""color"":[153,192,141]}', '15001001.15001091'),
    (15001093, 'Permian', 'Perm', 'Permien', 'Permiano', 93, '{""color"":[240,64,40]}', '15001001.15001091.15001093'),
    (15001095, 'Lopingian', 'Lopingien', 'Lopingien', 'Lopingiano', 94, '{""color"":[251,167,148]}', '15001001.15001091.15001093.15001095'),
    (15001096, 'Changhsingian', 'Changhsingien', 'Changhsingien', 'Changhsingiano', 95, '{""color"":[252,192,178]}', '15001001.15001091.15001093.15001095.0.15001096'),
    (15001098, 'Wuchiapingian', 'Wuchiapingien', 'Wuchiapingien', 'Wuchiapingiano', 96, '{""color"":[252,180,162]}', '15001001.15001091.15001093.15001095.0.15001098'),
    (15001101, 'Guadalupian', 'Guadalupien', 'Guadalupien', 'Guadalupiano', 97, '{""color"":[251,116,92]}', '15001001.15001091.15001093.15001101'),
    (15001102, 'Capitanian', 'Capitanien', 'Capitanien', 'Capitaniano', 98, '{""color"":[251,154,133]}', '15001001.15001091.15001093.15001101.0.15001102'),
    (15001106, 'Wordian', 'Wordien', 'Wordien', 'Wordiano', 99, '{""color"":[251,141,118]}', '15001001.15001091.15001093.15001101.0.15001106'),
    (15001108, 'Roadian', 'Roadien', 'Roadien', 'Roadiano', 100, '{""color"":[251,128,105]}', '15001001.15001091.15001093.15001101.0.15001108'),
    (15001110, 'Cisuralian', 'Cisuralien', 'Cisuralien', 'Cisuraliano', 101, '{""color"":[239,88,69]}', '15001001.15001091.15001093.15001110'),
    (15001111, 'Kungurian', 'Kungurien', 'Koungourien', 'Kunguriano', 102, '{""color"":[227,135,118]}', '15001001.15001091.15001093.15001110.0.15001111'),
    (15001113, 'Artinskian', 'Artinskien', 'Artinskien', 'Artinskiano', 103, '{""color"":[227,123,104]}', '15001001.15001091.15001093.15001110.0.15001113'),
    (15001115, 'Sakmarian', 'Sakmarien', 'Sakmarien', 'Sakmariano', 104, '{""color"":[227,111,92]}', '15001001.15001091.15001093.15001110.0.15001115'),
    (15001117, 'Asselian', 'Asselien', 'Assélien', 'Asseliano', 105, '{""color"":[227,99,80]}', '15001001.15001091.15001093.15001110.0.15001117'),
    (15001119, 'Carboniferous', 'Karbon', 'Carbonifère', 'Carbonifero', 106, '{""color"":[103,165,153]}', '15001001.15001091.15001119'),
    (15001120, 'Pennsylvanian', 'Pennsylvanien', 'Pennsylvanien', 'Pennsylvaniano', 107, '{""color"":[126,188,198]}', '15001001.15001091.15001119.15001120'),
    (15001121, 'Late Pennsylvanian', 'Spätes Pennsylvanien', 'Pennsylvanien tardif', 'Tardo Pennsylvaniano', 108, '{""color"":[191,208,186]}', '15001001.15001091.15001119.15001120.15001121'),
    (15001137, 'Gzhelian', 'Gzhélien', 'Gzhélien', 'Gzheliano', 109, '{""color"":[204,212,199]}', '15001001.15001091.15001119.15001120.15001121.15001137'),
    (15001138, 'Kasimovian', 'Kasimovien', 'Kasimovien', 'Kasimoviano', 110, '{""color"":[191,208,197]}', '15001001.15001091.15001119.15001120.15001121.15001138'),
    (15001122, 'Middle Pennsylvanian', 'Mittleres Pennsylvanien', 'Pennsylvanien moyen', 'Pennsylvaniano Medio', 111, '{""color"":[166,199,183]}', '15001001.15001091.15001119.15001120.15001122'),
    (15001139, 'Moscovian', 'Moscovien', 'Moscovien', 'Moscoviano', 112, '{""color"":[179,203,185]}', '15001001.15001091.15001119.15001120.15001122.15001139'),
    (15001123, 'Early Pennsylvanian', 'Frühes Pennsylvanien', 'Pennsylvanien précoce', 'Primo Pennsylvaniano', 113, '{""color"":[140,190,180]}', '15001001.15001091.15001119.15001120.15001123'),
    (15001140, 'Bashkirian', 'Bashkirien', 'Bashkirien', 'Bashkiriano', 114, '{""color"":[153,194,181]}', '15001001.15001091.15001119.15001120.15001123.15001140'),
    (15001124, 'Mississippian', 'Mississippien', 'Mississippien', 'Mississippiano', 115, '{""color"":[103,165,153]}', '15001001.15001091.15001119.15001124'),
    (15001125, 'Late Mississippian', 'Spätes Mississippien', 'Mississippien tardif', 'Tardo Mississippiano', 116, '{""color"":[179,190,108]}', '15001001.15001091.15001119.15001124.15001125'),
    (15001141, 'Serpukhovian', 'Serpukhovien', 'Serpukhovien', 'Serpukhoviano', 117, '{""color"":[191,194,107]}', '15001001.15001091.15001119.15001124.15001125.15001141'),
    (15001126, 'Middle Mississippian', 'Mittleres Mississippien', 'Mississippien moyen', 'Mississippiano Medio', 118, '{""color"":[153,180,108]}', '15001001.15001091.15001119.15001124.15001126'),
    (15001142, 'Visean', 'Viséen', 'Viséen', 'Viseano', 119, '{""color"":[166,185,108]}', '15001001.15001091.15001119.15001124.15001126.15001142'),
    (15001127, 'Early Mississippian', 'Frühes Mississippien', 'Mississippien précoce', 'Primo Mississippiano', 120, '{""color"":[128,171,108]}', '15001001.15001091.15001119.15001124.15001127'),
    (15001143, 'Tournaisian', 'Tournaisien', 'Tournaisien', 'Tournaisiano', 121, '{""color"":[140,176,108]}', '15001001.15001091.15001119.15001124.15001127.15001143'),
    (15001128, 'Devonian', 'Devon', 'Dévonien', 'Devoniano', 122, '{""color"":[203,140,55]}', '15001001.15001091.15001128'),
    (15001131, 'Late Devonian', 'Spätes Devon', 'Dévonien tardif', 'Tardo Devoniano', 123, '{""color"":[241,225,157]}', '15001001.15001091.15001128.15001131'),
    (15001130, 'Middle Devonian', 'Mittleres Devon', 'Dévonien moyen', 'Devoniano Medio', 124, '{""color"":[241,200,104]}', '15001001.15001091.15001128.15001130'),
    (15001129, 'Early Devonian', 'Frühes Devon', 'Dévonien tardif', 'Primo Devoniano', 125, '{""color"":[229,172,77]}', '15001001.15001091.15001128.15001129'),
    (15001133, 'Silurian', 'Silur', 'Silurien', 'Siluriano', 127, '{""color"":[179,225,182]}', '15001001.15001091.15001133'),
    (15001144, 'Pridoli', 'Pridoli', 'Pridoli', 'Pridoli', 128, '{""color"":[230,245,225]}', '15001001.15001091.15001133.15001144'),
    (15001145, 'Ludlow', 'Ludlow', 'Ludlow', 'Ludlow', 129, '{""color"":[191,230,207]}', '15001001.15001091.15001133.15001145'),
    (15001146, 'Wenlock', 'Wenlock', 'Wenlock', 'Wenlock', 130, '{""color"":[179,225,194]}', '15001001.15001091.15001133.15001146'),
    (15001147, 'Llandovery', 'Llandovery', 'Llandovery', 'Llandovery', 131, '{""color"":[153,215,179]}', '15001001.15001091.15001133.15001147'),
    (15001134, 'Ordovician', 'Ordovizium', 'Ordovicien', 'Ordoviciano', 132, '{""color"":[0,146,112]}', '15001001.15001091.15001134'),
    (15001148, 'Late Ordovician', 'Spätes Ordovizium', 'Ordovicien tardif', 'Tardo Ordoviciano', 133, '{""color"":[127,202,147]}', '15001001.15001091.15001134.15001148'),
    (15001149, 'Middle Ordovician', 'Mittleres Ordovizium', 'Ordovicien moyen', 'Ordoviciano Medio', 134, '{""color"":[77,180,126]}', '15001001.15001091.15001134.15001149'),
    (15001150, 'Early Ordovician', 'Frühes Ordovizium', 'Ordovicien précoce', 'Primo Ordoviciano', 135, '{""color"":[26,157,111]}', '15001001.15001091.15001134.15001150'),
    (15001135, 'Cambrian', 'Kambrium', 'Cambrien', 'Cambriano', 136, '{""color"":[127,160,86]}', '15001001.15001091.15001135'),
    (15001136, 'Proterozoic', 'Proterozoikum', 'Protérozoïque', 'Proterozoico', 138, '{""color"":[247,53,99]}', '15001136'),
    (15001153, 'Archean', 'Archaikum', 'Archéen', 'Archeano', 152, '{""color"":[240,4,127]}', '15001153');

DELETE FROM bdms.codelist cl WHERE schema_cli = 'custom.chronostratigraphy_top_bedrock' AND NOT EXISTS(
    SELECT * FROM new_chrono nc WHERE cl.geolcode = nc.geolcode
);

INSERT INTO bdms.codelist(id_cli, geolcode, schema_cli, code_cli, text_cli_en, description_cli_en, text_cli_de, description_cli_de, text_cli_fr, description_cli_fr, text_cli_it, description_cli_it, order_cli, conf_cli, path_cli)
SELECT geolcode, geolcode, 'custom.chronostratigraphy_top_bedrock', '', text_cli_en, '', text_cli_de, '', text_cli_fr, '', text_cli_it, '', order_cli, conf_cli, path_cli
FROM new_chrono
ON CONFLICT(id_cli) DO UPDATE SET
   text_cli_en = EXCLUDED.text_cli_en,
   text_cli_de = EXCLUDED.text_cli_de,
   text_cli_fr = EXCLUDED.text_cli_fr,
   text_cli_it = EXCLUDED.text_cli_it,
   order_cli = EXCLUDED.order_cli,
   conf_cli = EXCLUDED.conf_cli,
   path_cli = EXCLUDED.path_cli;
");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
    }
}
