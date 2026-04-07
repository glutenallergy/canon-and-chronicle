import { useState, useRef, useEffect, useMemo, useCallback, useLayoutEffect } from "react";

const TIMELINE_DATA = [
  /* ═══════════════ HISTORICAL EVENTS ═══════════════ */
  {
    year: -2000, endYear: -1800, label: "Patriarchal Period", type: "event", category: "biblical-events", subcategory: "creation-patriarchs", wiki: "Patriarchs_(Bible)",
    detail: "Traditional era of Abraham, Isaac, and Jacob, whose stories fill Genesis 12–50. The narratives depict a semi-nomadic clan moving between Mesopotamia, Canaan, and Egypt, bound to God by covenant promises of land and descendants. No contemporary written records exist; the material circulated orally for many centuries before being written down. Critical scholars often read the patriarchs as literary figures projecting later Israelite concerns onto an ancestral past, while more traditional readings preserve a historical kernel.",
    significance: "Establishes the Hebrew Bible's theological architecture — election, covenant, and promise — on which every subsequent biblical book builds its arguments.",
    quote: "Go from your country and your kindred to the land I will show you. — Genesis 12:1",
    sources: ["Genesis 12–50", "Van Seters, Abraham in History and Tradition", "Dever, Who Were the Early Israelites?"],
    relatedEvents: ["The Exodus", "J Source (Yahwist)"]
  },
  {
    year: -1446, label: "The Exodus", type: "event", category: "biblical-events", subcategory: "egypt-exodus", pin: true,
    detail: "Moses leads the Israelites out of Egyptian bondage, receives the Law at Mount Sinai, and begins 40 years of wilderness wandering. The traditional date of 1446 BCE derives from 1 Kings 6:1, though many scholars prefer a later 'low chronology' under Ramses II (~1250 BCE). No Egyptian records corroborate a mass departure, and archaeological evidence for a large Sinai migration is scarce. Whether read as literal history or foundational memory, the story became Israel's defining event.",
    significance: "Became the master narrative of Israelite identity — the paradigm of divine deliverance that prophets, psalmists, and eventually the Gospels all invoked.",
    quote: "Let my people go. — Exodus 5:1",
    sources: ["Exodus 1–15", "1 Kings 6:1", "Finkelstein & Silberman, The Bible Unearthed"],
    relatedEvents: ["Patriarchal Period", "Priestly Source & Torah", "Deuteronomist (D)"]
  },
  {
    year: -1200, endYear: -1020, label: "Period of the Judges", type: "event", category: "biblical-events", subcategory: "conquest-judges", wiki: "Biblical_judges",
    detail: "Loose tribal confederation in Canaan before the monarchy, recounted in the book of Judges and early 1 Samuel. Charismatic leaders — Deborah, Gideon, Samson — rise during regional crises to defend against Philistines, Moabites, and Midianites. The book presents a recurring cycle of apostasy, oppression, crying out, and deliverance. Scholars agree the underlying traditions are old, but the framing theology was added later by Deuteronomistic editors.",
    significance: "Supplies the template of covenant infidelity leading to national disaster — the interpretive lens later applied to the fall of both kingdoms.",
    quote: "In those days there was no king in Israel; all the people did what was right in their own eyes. — Judges 21:25",
    sources: ["Judges", "1 Samuel 1–7", "Noth, The Deuteronomistic History"],
    relatedEvents: ["The Exodus", "King David's Reign", "Deuteronomist (D)"]
  },
  {
    year: -1010, endYear: -970, label: "King David's Reign", type: "event", category: "biblical-events", subcategory: "united-kingdom", pin: true, wiki: "David",
    detail: "David unites the twelve tribes into a single monarchy centered on Jerusalem, establishing the dynasty that will rule Judah until the exile. The biblical accounts (1–2 Samuel) portray him as warrior, poet, and morally complex covenant-keeper. Archaeological evidence is debated but the Tel Dan inscription (9th century BCE) references the 'House of David' — the earliest extrabiblical confirmation. David is traditionally credited with many Psalms, though scholars view most as later compositions.",
    significance: "The Davidic covenant — God's promise of an eternal throne — becomes the seedbed of messianic expectation that the New Testament applies to Jesus.",
    quote: "Your throne shall be established forever. — 2 Samuel 7:16",
    sources: ["1–2 Samuel", "Tel Dan Stele", "Halpern, David's Secret Demons"],
    relatedEvents: ["Solomon & First Temple", "Psalms Finalized", "Birth of Jesus"]
  },
  {
    year: -970, endYear: -931, label: "Solomon & First Temple", type: "event", category: "biblical-events", subcategory: "united-kingdom", wiki: "Solomon%27s_Temple",
    detail: "Solomon succeeds David and builds the First Temple in Jerusalem (~960 BCE), transforming Israelite worship from portable tabernacle to fixed cultic center. Tradition credits him with authoring Proverbs, Ecclesiastes, and the Song of Solomon, though linguistic analysis dates the final forms of these books much later. His reign in 1 Kings is simultaneously celebrated (golden age of wisdom) and critiqued (excess, idolatry, harsh taxation). The Temple would stand for nearly four centuries until Babylon destroyed it.",
    significance: "The Temple becomes the geographical and theological anchor of Israelite religion, giving rise to the priestly tradition that shapes much of the Pentateuch.",
    quote: "I have built you an exalted house, a place for you to dwell forever. — 1 Kings 8:13",
    sources: ["1 Kings 1–11", "Finkelstein, David and Solomon"],
    relatedEvents: ["King David's Reign", "Priestly Source & Torah", "Babylonian Exile"]
  },
  {
    year: -931, label: "Kingdom Divides", type: "event", category: "biblical-events", subcategory: "divided-kingdom", wiki: "Kingdom_of_Israel_(united_monarchy)",
    detail: "After Solomon's death, the ten northern tribes reject his son Rehoboam and form the Kingdom of Israel under Jeroboam, leaving only Judah and Benjamin loyal to the Davidic line in the south. The two kingdoms develop separate religious traditions — the north builds rival shrines at Bethel and Dan; the south centralizes worship in Jerusalem. Distinct literary sources (E in the north, J in the south) likely originate in this period. The split fundamentally shapes the composition history of the Hebrew Bible.",
    significance: "The division produces two parallel religious and literary traditions whose eventual merging creates the composite, multi-sourced Pentateuch.",
    quote: "What share have we in David? To your tents, O Israel! — 1 Kings 12:16",
    sources: ["1 Kings 11–12", "Friedman, Who Wrote the Bible?"],
    relatedEvents: ["J Source (Yahwist)", "E Source (Elohist)", "Fall of North Kingdom"]
  },
  {
    year: -722, label: "Fall of North Kingdom", type: "event", category: "biblical-events", subcategory: "divided-kingdom", wiki: "Fall_of_Samaria",
    detail: "The Assyrian king Shalmaneser V (and his successor Sargon II) conquers Samaria after a three-year siege, ending the northern Kingdom of Israel. Tens of thousands of Israelites are deported to the Assyrian heartland and replaced with colonists from elsewhere — producing the population that later becomes the Samaritans. The ten northern tribes largely disappear from history. The crisis appears to have spurred southern scribes to preserve threatened northern traditions in writing.",
    significance: "The trauma forced scriptural consolidation: traditions that might have survived only orally in the north were urgently written down in the south.",
    quote: "In the ninth year of Hoshea the king of Assyria captured Samaria. — 2 Kings 17:6",
    sources: ["2 Kings 17", "Assyrian annals of Sargon II"],
    relatedEvents: ["Kingdom Divides", "Early Prophets", "Deuteronomist (D)"]
  },
  {
    year: -621, label: "Josiah's Reform", type: "event", category: "biblical-events", subcategory: "divided-kingdom", wiki: "Josiah",
    detail: "During Temple renovations, the high priest Hilkiah discovers a 'book of the law' that scholars almost universally identify as an early form of Deuteronomy. King Josiah reads it, tears his clothes, and launches sweeping reforms — destroying rural shrines, centralizing worship in Jerusalem, and reviving Passover. Whether the scroll was genuinely ancient or composed recently by reforming priests is debated. Either way, it represents the first recorded moment a written text directly drives Israelite religious policy.",
    significance: "Marks the decisive shift from oral to textual authority in Israelite religion — the prototype of Judaism and Christianity as 'religions of the book.'",
    quote: "I have found the book of the law in the house of the Lord. — 2 Kings 22:8",
    sources: ["2 Kings 22–23", "2 Chronicles 34–35"],
    relatedEvents: ["Deuteronomist (D)", "Babylonian Exile"]
  },
  {
    year: -586, label: "Babylonian Exile", type: "event", category: "biblical-events", subcategory: "exile-babylon", pin: true,
    detail: "Nebuchadnezzar II captures Jerusalem, destroys Solomon's Temple, and deports the Judahite elite to Babylon, ending the independent kingdom of Judah. Without Temple, land, or king, the exiles face an existential crisis: how to be God's people in a foreign land. The response is one of the most creative periods in Jewish religious history — much of the Torah reaches its final form, Ezekiel's visions are recorded, and 'Second Isaiah' composes soaring poetry of return. The written word becomes the portable homeland.",
    significance: "The central hinge of the Hebrew Bible. Without the Temple to anchor worship, Israel becomes a textual community — the very conditions that made the Bible possible.",
    quote: "By the rivers of Babylon, there we sat down and wept. — Psalm 137:1",
    sources: ["2 Kings 24–25", "Jeremiah 52", "Ezekiel", "Isaiah 40–55"],
    relatedEvents: ["Priestly Source & Torah", "Jeremiah & Ezekiel", "Return from Exile"]
  },
  {
    year: -538, label: "Return from Exile", type: "event", category: "biblical-events", subcategory: "return-restoration", wiki: "Return_to_Zion",
    detail: "Cyrus the Great of Persia conquers Babylon and issues a decree allowing the Judean exiles to return home and rebuild their Temple. The initial returnees lay a foundation around 536 BCE; the Second Temple is completed around 516 BCE. Later waves led by Ezra (a scribe-priest) and Nehemiah (a Persian-appointed governor) reform the community around strict Torah observance. Ezra is traditionally credited with assembling the Torah in its final form.",
    significance: "The 'Great Assembly' of this period transforms Judaism into a scripture-centered religion and effectively closes the first division of the Hebrew canon.",
    quote: "Thus says Cyrus king of Persia... he has charged me to build him a house at Jerusalem. — Ezra 1:2",
    sources: ["Ezra", "Nehemiah", "Cyrus Cylinder"],
    relatedEvents: ["Babylonian Exile", "Priestly Source & Torah", "Chronicles, Ezra, Nehemiah"]
  },
  {
    year: -332, label: "Alexander Conquers", type: "event", category: "biblical-events", subcategory: "intertestamental", wiki: "Wars_of_Alexander_the_Great",
    detail: "Alexander the Great defeats the Persian Empire and conquers the Levant in 332 BCE, inaugurating the Hellenistic period. Greek becomes the lingua franca of the eastern Mediterranean, and Greek culture — philosophy, language, literature, civic life — penetrates Jewish society, especially among diaspora communities in Alexandria. Within a century, Jewish scriptures begin to be translated into Greek (the Septuagint). Hellenization also produces the cultural friction that will erupt in the Maccabean Revolt.",
    significance: "Creates the linguistic and cultural conditions for the New Testament — written in Greek, shaped by Hellenistic thought, and addressed to a Greek-speaking world.",
    quote: "Alexander... after he had defeated Darius king of the Persians, succeeded him as king. — 1 Maccabees 1:1",
    sources: ["1 Maccabees 1", "Josephus, Antiquities 11"],
    relatedEvents: ["Septuagint Begins", "Maccabean Revolt"]
  },
  {
    year: -167, endYear: -160, label: "Maccabean Revolt", type: "event", category: "biblical-events", subcategory: "intertestamental",
    detail: "When the Seleucid king Antiochus IV Epiphanes bans Jewish practice and desecrates the Temple by sacrificing a pig on the altar, the priestly Hasmonean family leads a successful revolt. Judas Maccabeus retakes Jerusalem in 164 BCE and rededicates the Temple — the origin of Hanukkah. The books of 1 and 2 Maccabees recount the uprising and become part of the Catholic and Orthodox canons. The Book of Daniel, written in veiled code during this crisis, appears to predict these events in uncanny detail.",
    significance: "Preserves Jewish religious distinctiveness against Hellenization and produces Daniel — the last Old Testament book and the template for apocalyptic literature.",
    quote: "Let everyone who is zealous for the law and supports the covenant come out with me! — 1 Maccabees 2:27",
    sources: ["1 & 2 Maccabees", "Daniel 7–12", "Josephus, Antiquities 12"],
    relatedEvents: ["Daniel Written", "Septuagint Begins"]
  },
  {
    year: -6, label: "Birth of Jesus", type: "event", category: "biblical-events", subcategory: "life-of-christ", pin: true, wiki: "Nativity_of_Jesus",
    detail: "Most scholars place Jesus's birth between 6 and 4 BCE, before the death of Herod the Great (who dies in 4 BCE). The year 1 CE was calculated by the 6th-century monk Dionysius Exiguus, who almost certainly erred by several years. Matthew and Luke provide the two canonical nativity accounts — differing significantly in details and genealogy but agreeing on Bethlehem as birthplace and virginal conception. Mark and John open with Jesus as an adult and include no birth narrative.",
    significance: "Christianity's foundational event — but notably, the earliest Christian writings (Paul's letters) show no interest in it. Birth narratives appear decades later.",
    quote: "In the days of King Herod of Judea... — Luke 1:5",
    sources: ["Matthew 1–2", "Luke 1–2", "Josephus, Antiquities 17"],
    relatedEvents: ["Ministry of Jesus", "Matthew & Luke", "Crucifixion & Resurrection"]
  },
  {
    year: 27, endYear: 30, label: "Ministry of Jesus", type: "event", category: "biblical-events", subcategory: "life-of-christ",
    detail: "Jesus conducts a public teaching and healing ministry primarily in Galilee, with trips to Jerusalem, over a period most scholars estimate at one to three years. He gathers disciples, preaches the 'kingdom of God,' performs exorcisms and healings, and increasingly clashes with religious authorities. No writings from Jesus himself survive; his teachings are preserved through decades of oral transmission before being written down. The earliest Gospel (Mark) appears roughly 35–40 years after his death.",
    significance: "Everything Christianity claims about Jesus rests on this oral period — the gap between the events and the written Gospels is where scholars locate the most critical interpretive questions.",
    quote: "The kingdom of God has come near; repent, and believe in the good news. — Mark 1:15",
    sources: ["Mark", "Matthew", "Luke", "John", "Tacitus, Annals 15.44"],
    relatedEvents: ["Birth of Jesus", "Crucifixion & Resurrection", "Gospel of Mark"]
  },
  {
    year: 30, label: "Crucifixion & Resurrection", type: "event", category: "biblical-events", subcategory: "life-of-christ", pin: true, wiki: "Crucifixion_of_Jesus",
    detail: "Jesus is executed by crucifixion under the Roman prefect Pontius Pilate, almost certainly during Passover, traditionally dated to 30 or 33 CE. The Gospels agree that his body was buried in a rock-hewn tomb and that women — especially Mary Magdalene — were the first to find the tomb empty. Resurrection appearances follow. Paul's 1 Corinthians 15 (written ~55 CE) contains the earliest preserved creed affirming these events, which Paul says he 'received' — meaning it is older still.",
    significance: "The resurrection is Christianity's claim of origin. Everything the New Testament says about Jesus's identity, the Church's existence, and salvation flows from it.",
    quote: "He is not here; for he has been raised. — Matthew 28:6",
    sources: ["1 Corinthians 15:3–8", "Mark 15–16", "Tacitus, Annals 15.44"],
    relatedEvents: ["Ministry of Jesus", "Conversion of Paul", "Gospel of Mark"]
  },
  {
    year: 35, label: "Conversion of Paul", type: "event", category: "biblical-events", subcategory: "early-church", wiki: "Conversion_of_Paul_the_Apostle",
    detail: "Saul of Tarsus, a Pharisee actively persecuting early Christians, has a vision of the risen Jesus on the road to Damascus and becomes the movement's most influential missionary. Within about 17 years he is planting churches across Asia Minor, Greece, and Rome, and writing the letters that will become the earliest documents in the New Testament. Paul never met the historical Jesus during his ministry. His theology — centered on grace, faith, and the inclusion of Gentiles — reshapes Christianity from a Jewish sect into a universal religion.",
    significance: "Paul's letters are the oldest surviving Christian writings — predating even the Gospels by a decade or more — and his interpretation of Jesus's death becomes foundational Christian theology.",
    quote: "By the grace of God I am what I am. — 1 Corinthians 15:10",
    sources: ["Acts 9", "Galatians 1", "Paul's undisputed letters"],
    relatedEvents: ["Paul's Early Letters", "Council of Jerusalem", "Pastoral Epistles"]
  },
  {
    year: 49, label: "Council of Jerusalem", type: "event", category: "biblical-events", subcategory: "early-church",
    detail: "Peter, Paul, James (brother of Jesus), and other apostles meet in Jerusalem around 49 CE to resolve whether Gentile converts must follow Jewish law — specifically, whether they must be circumcised and observe kosher laws. The decision, recorded in Acts 15 and referenced by Paul in Galatians 2, is that Gentiles need not become Jewish to follow Jesus, though they should observe a minimal ethical code. The accounts in Acts and Galatians differ in tone and detail, hinting at ongoing tensions.",
    significance: "The single most important institutional decision of the first Christian century — it opens the door to the Gentile mission that will make Christianity a world religion.",
    quote: "We should not trouble those Gentiles who are turning to God. — Acts 15:19",
    sources: ["Acts 15", "Galatians 2"],
    relatedEvents: ["Conversion of Paul", "Paul's Early Letters", "James"]
  },
  {
    year: 64, endYear: 68, label: "Nero's Persecution", type: "event", category: "biblical-events", subcategory: "early-church", wiki: "Great_Fire_of_Rome",
    detail: "After the Great Fire of Rome in 64 CE, Emperor Nero blames the Christian community to deflect suspicion from himself. According to Tacitus, Christians are crucified, burned as torches, and thrown to dogs — the first major Roman persecution of the movement. Church tradition (with reasonable historical support) places the martyrdoms of both Peter and Paul during this persecution, Peter crucified upside-down and Paul beheaded. The trauma strengthens Christian identity but also creates the apocalyptic worldview reflected in much later New Testament writing.",
    significance: "Martyrdom becomes part of Christian identity. The experience also fuels the apocalyptic expectation visible in Revelation and some later Gospel material.",
    quote: "Their deaths were made a matter of sport. — Tacitus, Annals 15.44",
    sources: ["Tacitus, Annals 15.44", "1 Clement 5–6"],
    relatedEvents: ["Paul's Major Letters", "1 Peter", "Revelation"]
  },
  {
    year: 70, label: "Temple Destroyed", type: "event", category: "biblical-events", subcategory: "early-church", pin: true, wiki: "Siege_of_Jerusalem_(70_CE)",
    detail: "Titus, son of Emperor Vespasian, leads Roman legions to crush the Jewish Revolt, sacks Jerusalem, and destroys the Second Temple. According to Josephus, over a million Jews die in the war and many survivors are enslaved. The sacrificial cult of Judaism ends forever — rabbinic Judaism (centered on Torah study) and Christianity (centered on Jesus as the 'new temple') both emerge partly in response to this void. The destruction also accelerates Gospel writing, as eyewitnesses age and die.",
    significance: "The single most consequential historical event for the formation of the New Testament. Mark, Matthew, Luke, and John all write in its aftermath, interpreting it as divine judgment or fulfillment of Jesus's prophecies.",
    quote: "Not one stone will be left here upon another. — Mark 13:2",
    sources: ["Josephus, The Jewish War", "Mark 13", "Matthew 24", "Luke 21"],
    relatedEvents: ["Gospel of Mark", "Matthew & Luke", "Council of Jamnia"]
  },
  {
    year: 132, endYear: 135, label: "Bar Kokhba Revolt", type: "event", category: "biblical-events", subcategory: "early-church", wiki: "Bar_Kokhba_revolt",
    detail: "Simon bar Kokhba leads a second, final Jewish revolt against Rome. Rabbi Akiva reportedly hails him as the Messiah. The initial rebellion succeeds spectacularly — Jews briefly retake Jerusalem and strike their own coins — before Emperor Hadrian's legions crush the revolt with genocidal violence. Jews are banned from Jerusalem, which is renamed Aelia Capitolina. The failure permanently discredits messianic military resistance in Jewish thought and deepens the separation between Judaism and Christianity, which had not supported the revolt.",
    significance: "Completes the institutional separation of Church and Synagogue. Jewish Christians who refused to recognize Bar Kokhba were excluded from Jewish communities.",
    quote: "Do not call him 'Son of a Star' (Bar Kokhba), but 'Son of a Lie' (Bar Koziba). — R. Yohanan ben Torta",
    sources: ["Cassius Dio 69", "Talmud, Gittin 57a–58a"],
    relatedEvents: ["Temple Destroyed", "Council of Jamnia"]
  },
  {
    year: 303, endYear: 311, label: "Great Persecution", type: "event", category: "biblical-events", subcategory: "early-church", wiki: "Diocletianic_Persecution",
    detail: "Emperor Diocletian launches the final and most systematic Roman persecution of Christians (303–311). Edicts order the destruction of churches, burning of Christian scriptures, and torture of those who refuse to sacrifice to Roman gods. The demand to surrender scriptures forces individual Christian communities to decide — often under threat of death — which texts are truly sacred and which can be handed over. The period creates the category of traditores ('betrayers') and sparks intense debate about canon.",
    significance: "Forces the question of canon from theology into life-or-death practice. Communities had to know exactly which books were worth dying for.",
    quote: "He ordered that the assembled scriptures should be burned. — Eusebius, Church History 8.2",
    sources: ["Eusebius, Church History 8", "Lactantius, On the Deaths of the Persecutors"],
    relatedEvents: ["Edict of Milan", "Eusebius's Categories"]
  },
  {
    year: 313, label: "Edict of Milan", type: "event", category: "biblical-events", subcategory: "early-church",
    detail: "Emperor Constantine and his co-emperor Licinius issue a joint declaration granting religious freedom to all within the Roman Empire, ending the legal persecution of Christianity. Confiscated church property is returned. Constantine had already converted (at least politically) after his victory at the Milvian Bridge in 312. Christianity rapidly transforms from a persecuted minority to the favored religion of the empire — a shift that will reshape the Church's institutions, theology, and scripture-making.",
    significance: "Begins Christianity's improbable journey from criminalized sect to state religion — and creates the political conditions for the imperial councils that would finalize doctrine and canon.",
    quote: "We grant to Christians and to all men freedom to follow whichever religion each may wish. — Edict of Milan",
    sources: ["Lactantius, On the Deaths of the Persecutors 48", "Eusebius, Church History 10"],
    relatedEvents: ["Great Persecution", "Council of Nicaea"]
  },
  {
    year: 325, label: "Council of Nicaea", type: "event", category: "biblical-events", subcategory: "early-church", pin: true, wiki: "First_Council_of_Nicaea",
    detail: "Emperor Constantine convenes the first ecumenical council of bishops to resolve the Arian controversy — whether Jesus was fully divine and co-eternal with the Father, or a created being. Roughly 300 bishops attend; they produce the Nicene Creed affirming that Christ is 'of the same substance' (homoousios) with the Father. Popular myth claims the council voted on the biblical canon. This is false — Nicaea addressed only Christological doctrine, not which books belonged in the Bible.",
    significance: "Sets the pattern of imperial ecumenical councils as the mechanism for Christian orthodoxy. Contrary to popular belief, the canon was NOT discussed here.",
    quote: "God from God, Light from Light, true God from true God, begotten not made. — Nicene Creed",
    sources: ["Eusebius, Life of Constantine 3", "Ehrman, The Orthodox Corruption of Scripture"],
    relatedEvents: ["Edict of Milan", "Athanasius's Letter"]
  },

  /* ═══════════════ OT WRITINGS ═══════════════ */
  {
    year: -950, endYear: -900, label: "J Source (Yahwist)", type: "writing-ot", category: "books", subcategory: "ot-sources", wiki: "Jahwist",
    attributed: "Moses (traditional)",
    scholarly: "Unknown — possibly southern Judahite court scribes",
    dispute: "High — Documentary Hypothesis itself is debated",
    detail: "The hypothetical earliest literary strand of the Pentateuch, identified by its use of the divine name YHWH from Genesis 2 onward. J portrays God in vivid, anthropomorphic terms — walking in the garden, closing the ark door, smelling Noah's sacrifice. Scholars place its composition in the southern kingdom of Judah, possibly at the court of Solomon or slightly later. The Documentary Hypothesis itself remains debated, with some scholars rejecting J's independent existence entirely, but the distinctive voice it identifies is widely recognized.",
    significance: "The foundational proposal of modern biblical criticism — that the Torah is a composite document woven from distinct, earlier sources.",
    quote: "In the day that the LORD God made the earth and the heavens... — Genesis 2:4b",
    sources: ["Wellhausen, Prolegomena to the History of Israel", "Friedman, Who Wrote the Bible?"],
    relatedEvents: ["E Source (Elohist)", "Priestly Source & Torah", "King David's Reign"]
  },
  {
    year: -850, endYear: -800, label: "E Source (Elohist)", type: "writing-ot", category: "books", subcategory: "ot-sources", wiki: "Elohist",
    attributed: "Moses (traditional)",
    scholarly: "Unknown — possibly northern Israelite scribes",
    dispute: "High — some defend E, others say it never existed separately",
    detail: "A second hypothetical Pentateuchal strand identified by its use of 'Elohim' for God (rather than YHWH) until Exodus 3, where the divine name is revealed to Moses. E portrays God as more distant — communicating through dreams, angels, and prophetic intermediaries. It is thought to have originated in the northern kingdom of Israel, possibly preserved after 722 BCE by refugees fleeing south. Some scholars question whether E ever existed as a separate document, viewing it instead as fragmentary supplements to J.",
    significance: "Represents a distinct northern theological voice that may have been rescued and woven into the scriptures after the Assyrian conquest of 722 BCE.",
    quote: "God spoke to Israel in visions of the night. — Genesis 46:2",
    sources: ["Wellhausen, Prolegomena", "Friedman, Who Wrote the Bible?"],
    relatedEvents: ["J Source (Yahwist)", "Fall of North Kingdom", "Priestly Source & Torah"]
  },
  {
    year: -760, endYear: -700, label: "Early Prophets", type: "writing-ot", category: "books", subcategory: "ot-sources", wiki: "Nevi%27im",
    attributed: "Amos, Hosea, Isaiah, Micah",
    scholarly: "Core from these prophets, shaped by later editors",
    dispute: "Moderate — Isaiah clearest case of multiple authors",
    detail: "The earliest writing prophets emerge in the 8th century BCE during periods of political crisis and social upheaval. Amos condemns economic injustice in the northern kingdom around 760; Hosea denounces idolatry through the metaphor of an unfaithful wife around 750; Isaiah (chapters 1–39) warns the Davidic court during the Assyrian crisis around 740–700; Micah attacks corrupt rural elites around 735. These prophets radically redefine Israelite religion — insisting that God cares more about justice and faithfulness than ritual.",
    significance: "Introduces the prophetic critique as a permanent voice within biblical religion — the ethical conscience that Jesus would later explicitly invoke.",
    quote: "Let justice roll down like waters, and righteousness like an ever-flowing stream. — Amos 5:24",
    sources: ["Amos", "Hosea", "Isaiah 1–39", "Micah"],
    relatedEvents: ["Fall of North Kingdom", "Jeremiah & Ezekiel", "Ministry of Jesus"]
  },
  {
    year: -650, endYear: -600, label: "Deuteronomist (D)", type: "writing-ot", category: "books", subcategory: "ot-sources", wiki: "Deuteronomist",
    attributed: "Moses (traditional)",
    scholarly: "Unknown — possibly Levitical priests at Josiah's court",
    dispute: "Moderate — distinct voice widely accepted",
    detail: "The core of the book of Deuteronomy, likely composed by reforming priests or Levites in the late 7th century BCE, possibly at the Josianic court. D's distinctive themes include covenant loyalty, centralized worship (only in Jerusalem), and the theology of reward-for-obedience and punishment-for-disobedience. This theology becomes the interpretive framework for the 'Deuteronomistic History' (Joshua through 2 Kings), which reads Israel's entire national story as a morality play. D's discovery (or composition) may have been the 'book of the law' found during Josiah's reform.",
    significance: "Deuteronomy becomes the most influential theological book in the Hebrew Bible — quoted more often in the New Testament than any other Torah book except Psalms.",
    quote: "You shall love the LORD your God with all your heart, and with all your soul, and with all your might. — Deuteronomy 6:5",
    sources: ["Deuteronomy", "Noth, The Deuteronomistic History"],
    relatedEvents: ["Josiah's Reform", "J Source (Yahwist)", "Priestly Source & Torah"]
  },
  {
    year: -600, endYear: -500, label: "Jeremiah & Ezekiel", type: "writing-ot", category: "books", subcategory: "ot-sources", wiki: "Book_of_Jeremiah",
    attributed: "Jeremiah (with Baruch), Ezekiel, Isaiah",
    scholarly: "Jeremiah heavily edited. 'Second Isaiah' (chs. 40–55) separate author.",
    dispute: "Low for Ezekiel. Moderate for Jeremiah. High consensus: Isaiah has 2–3 authors.",
    detail: "Jeremiah prophesies in Jerusalem before and during the Babylonian siege, preserving his oracles through his scribe Baruch — and weeping as his predictions come true. Ezekiel, deported in an earlier wave, prophesies to the exile community in Babylon with vivid, sometimes bizarre visions (wheels within wheels, a valley of dry bones). A second anonymous author, known as 'Deutero-Isaiah,' writes chapters 40–55 of Isaiah during the exile, proclaiming comfort and return. The critical consensus that Isaiah has multiple authors is one of the most settled conclusions of modern scholarship.",
    significance: "These prophets make theological sense of catastrophe — transforming the destruction of Temple and nation into a story of divine refining and coming restoration.",
    quote: "I will put my law within them, and I will write it on their hearts. — Jeremiah 31:33",
    sources: ["Jeremiah", "Ezekiel", "Isaiah 40–55"],
    relatedEvents: ["Babylonian Exile", "Return from Exile", "Priestly Source & Torah"]
  },
  {
    year: -500, endYear: -400, label: "Priestly Source & Torah", type: "writing-ot", category: "books", subcategory: "ot-sources", wiki: "Priestly_source",
    attributed: "Moses; Ezra for compilation",
    scholarly: "Priestly scribes during/after exile. Compilation: Ezra's circle.",
    dispute: "Moderate — P widely accepted but dating debated",
    detail: "The Priestly source (P) — identified by its genealogies, ritual detail, and formal, elevated prose — is composed by priestly scribes during and after the exile. P provides the majestic Genesis 1 creation account, the tabernacle instructions, Leviticus, and much of the legal material. A final redactor (possibly Ezra's circle) weaves J, E, D, and P into the five-book Torah we have today, probably around 400 BCE. This is the book that Ezra reads publicly in Nehemiah 8 — the first canonical scripture.",
    significance: "The final redaction fixes the Torah as the first canonical unit of the Hebrew Bible. From this point forward, it is 'Scripture' in the technical sense.",
    quote: "In the beginning God created the heavens and the earth. — Genesis 1:1",
    sources: ["Genesis 1", "Leviticus", "Nehemiah 8", "Friedman, Who Wrote the Bible?"],
    relatedEvents: ["Babylonian Exile", "Return from Exile", "Chronicles, Ezra, Nehemiah"]
  },
  {
    year: -450, endYear: -400, label: "Chronicles, Ezra, Nehemiah", type: "writing-ot", category: "books", subcategory: "ot-sources", wiki: "Books_of_Chronicles",
    attributed: "Ezra (Talmud)",
    scholarly: "Unknown 'Chronicler' — shared authorship debated",
    dispute: "Moderate",
    detail: "A single literary work (split across three books in Christian Bibles) that retells Israel's history from Adam through the post-exilic restoration, written from a priestly and Davidic perspective. The Chronicler rewrites earlier material (especially Samuel-Kings), softening moral failures of David and Solomon and emphasizing Temple worship. Ezra-Nehemiah focuses on the return from exile and the rebuilding of Jerusalem under Persian rule. Traditional Jewish attribution to Ezra himself is generally rejected by modern scholars, who identify an anonymous 'Chronicler' working around 400 BCE.",
    significance: "The last historical books composed in the Hebrew Bible, closing the narrative arc of the Old Testament and setting the stage for the Second Temple period.",
    quote: "All the kingdoms of the earth the LORD the God of heaven has given me. — 2 Chronicles 36:23",
    sources: ["1–2 Chronicles", "Ezra", "Nehemiah"],
    relatedEvents: ["Return from Exile", "Priestly Source & Torah"]
  },
  {
    year: -400, endYear: -300, label: "Psalms Finalized", type: "writing-ot", category: "books", subcategory: "ot-sources", wiki: "Psalms",
    attributed: "David (73), Asaph, Sons of Korah, others",
    scholarly: "Multiple authors. 'Of David' may not mean 'by David.'",
    dispute: "Moderate to high",
    detail: "The 150 psalms in the Hebrew Bible span perhaps 800 years of composition — from possible Davidic originals in the 10th century BCE to post-exilic compositions. They are organized into five 'books' mirroring the Torah, with doxologies at the end of each. Traditional attributions ('A Psalm of David,' 'Of Asaph,' 'Of the Sons of Korah') may indicate authorship, dedication, or collection — scholars disagree. The final compilation likely occurred in the post-exilic period, making Psalms effectively the prayer book of Second Temple Judaism and, later, the Church.",
    significance: "The most-quoted Old Testament book in the New Testament and the foundation of both Jewish and Christian liturgical prayer.",
    quote: "The LORD is my shepherd, I shall not want. — Psalm 23:1",
    sources: ["Psalms", "Gillingham, Psalms Through the Centuries"],
    relatedEvents: ["King David's Reign", "Return from Exile"]
  },
  {
    year: -300, endYear: -250, label: "Septuagint Begins", type: "writing-ot", category: "books", subcategory: "ot-sources", wiki: "Septuagint",
    attributed: "72 elders (legendary)",
    scholarly: "Multiple translators in Alexandria",
    dispute: "Low",
    detail: "Jewish scholars in Alexandria begin translating the Hebrew scriptures into Greek, producing what becomes known as the Septuagint (LXX) — from the legendary account in the Letter of Aristeas of 72 elders translating in 72 days. The project starts with the Torah around 250 BCE and continues over the next two centuries, eventually covering all Hebrew books plus additional texts not preserved in Hebrew (Tobit, Judith, Wisdom, Sirach, 1–2 Maccabees). The Septuagint becomes the standard scripture of diaspora Judaism and, later, of the early Christian church.",
    significance: "The New Testament authors overwhelmingly quote the Septuagint, not the Hebrew. When Catholic and Protestant Old Testaments differ today, it's because they started from different textual traditions.",
    quote: "Seventy-two elders... completed the translation in seventy-two days. — Letter of Aristeas 301–307",
    sources: ["Septuagint", "Letter of Aristeas", "Philo, Life of Moses 2"],
    relatedEvents: ["Alexander Conquers", "Daniel Written", "Council of Trent"]
  },
  {
    year: -200, endYear: -165, label: "Daniel Written", type: "writing-ot", category: "books", subcategory: "ot-sources", wiki: "Book_of_Daniel",
    storyStart: -605, storyEnd: -536,
    attributed: "Daniel (set in 6th c. BCE)",
    scholarly: "Unknown author ~165 BCE",
    dispute: "High — conservatives vs. critical scholars",
    detail: "The Book of Daniel is set in the 6th century BCE (among the Babylonian exiles) but most critical scholars date its final composition to ~165 BCE during the Maccabean crisis. The 'prophecies' in chapters 7–12 are uncannily accurate down to the persecution of Antiochus IV — and then become inaccurate about what happens after. This pattern (accurate history described as prophecy, then failed predictions about the future) is the signature of vaticinium ex eventu — prophecy after the fact. Conservative scholars defend traditional dating; critical consensus is firmly for the late date.",
    significance: "The last book added to the Hebrew canon and the template for all later Jewish and Christian apocalyptic writing — directly influencing Revelation.",
    quote: "I was watching in the night visions, and behold, one like a son of man... — Daniel 7:13",
    sources: ["Daniel", "1 Maccabees", "Collins, A Commentary on the Book of Daniel"],
    relatedEvents: ["Maccabean Revolt", "Revelation"]
  },

  /* ═══════════════ DEUTEROCANONICAL WRITINGS ═══════════════ */
  {
    year: -180, label: "Sirach (Ecclesiasticus)", type: "writing-deuterocanon", category: "books", subcategory: "deuterocanonical-books", wiki: "Sirach",
    attributed: "Jesus ben Sira (Yeshua ben Eleazar ben Sira)",
    scholarly: "Ben Sira — one of the rare OT authors we can name with confidence",
    dispute: "Low for authorship. High for canonicity — Jewish and Protestant traditions exclude it.",
    detail: "A wisdom book written in Hebrew by a Jerusalem sage around 180 BCE, later translated into Greek by his grandson in Alexandria. Often called 'the other Proverbs,' Sirach offers practical ethical instruction, hymns of praise, and a famous catalogue of Israel's heroes (chapters 44–50). It was widely read by Jews and quoted extensively by early church fathers. Despite its popularity, it was excluded from the Jewish canon — possibly because it was written too recently to be considered prophetically inspired.",
    significance: "The most important book for understanding the gap between 'widely loved' and 'canonical.' Its exclusion by rabbis while being embraced by Christians illuminates how canon boundaries form.",
    quote: "All wisdom is from the Lord, and with him it remains forever. — Sirach 1:1",
    sources: ["Sirach", "Di Lella, The Wisdom of Ben Sira (Anchor Bible)"],
    relatedEvents: ["Psalms Finalized", "Septuagint Begins", "Council of Trent"]
  },
  {
    year: -150, endYear: -100, label: "Tobit", type: "writing-deuterocanon", category: "books", subcategory: "deuterocanonical-books", wiki: "Book_of_Tobit",
    storyStart: -750, storyEnd: -650,
    attributed: "Unknown — presented as memoir of Tobit",
    scholarly: "Anonymous author, probably 2nd century BCE diaspora",
    dispute: "No authorship dispute. Excluded from Jewish and Protestant canons; included in Catholic and Orthodox.",
    detail: "A charming novella about a devout Israelite family in the Assyrian diaspora. Tobit, blinded by bird droppings while performing acts of piety, sends his son Tobias on a journey accompanied by the angel Raphael in disguise. The story weaves together themes of faithfulness in exile, angelic intervention, marriage, and healing. Fragments found among the Dead Sea Scrolls show it was read at Qumran, and it was popular across Jewish and early Christian communities.",
    significance: "A window into Jewish piety and theology in the diaspora period — and one of the most entertaining reads in the biblical tradition.",
    quote: "Do not be afraid, for he was destined for you from eternity. — Tobit 6:18",
    sources: ["Tobit", "Qumran fragments 4Q196–200"],
    relatedEvents: ["Septuagint Begins", "Dead Sea Scrolls Discovery"]
  },
  {
    year: -100, label: "1 Maccabees", type: "writing-deuterocanon", category: "books", subcategory: "deuterocanonical-books", wiki: "1_Maccabees",
    storyStart: -175, storyEnd: -134,
    attributed: "Unknown — an educated Judean supporter of the Hasmonean dynasty",
    scholarly: "Anonymous, likely late 2nd or early 1st century BCE",
    dispute: "Considered historically reliable by most scholars. Not in Jewish or Protestant canons; in Catholic and Orthodox.",
    detail: "A sober, historically grounded account of the Maccabean Revolt (167–134 BCE) and the establishment of the Hasmonean dynasty. Written in a style deliberately echoing the biblical books of Samuel and Kings, it presents Judas Maccabeus and his brothers as divinely guided liberators. Unlike 2 Maccabees, it avoids supernatural embellishments and is generally trusted by historians as a primary source for the period. Originally composed in Hebrew, but the Hebrew text is lost — only the Greek Septuagint version survives.",
    significance: "Our best historical source for the Maccabean period. Its exclusion from the Jewish canon despite its historical value shows that canonicity was about theology, not just accuracy.",
    quote: "Let everyone who is zealous for the law and supports the covenant come out with me! — 1 Maccabees 2:27",
    sources: ["1 Maccabees", "Josephus, Antiquities 12–13"],
    relatedEvents: ["Maccabean Revolt", "2 Maccabees", "Hasmonean"]
  },
  {
    year: -124, label: "2 Maccabees", type: "writing-deuterocanon", category: "books", subcategory: "deuterocanonical-books", wiki: "2_Maccabees",
    storyStart: -180, storyEnd: -161,
    attributed: "Epitomist of Jason of Cyrene",
    scholarly: "Anonymous abridger working from a lost 5-volume history",
    dispute: "Less historically reliable than 1 Maccabees. Not in Jewish or Protestant canons; in Catholic and Orthodox.",
    detail: "An abridgment of a lost five-volume history by Jason of Cyrene, covering roughly 180–161 BCE. More theologically driven than 1 Maccabees, it introduces concepts that become important in later Christianity: explicit belief in bodily resurrection of the dead, the efficacy of prayer for the deceased, and martyrdom as atonement. The graphic accounts of the martyrdom of Eleazar and the seven brothers (chapter 7) became foundational for Christian martyr theology.",
    significance: "The primary biblical basis for the Catholic doctrine of purgatory and prayer for the dead — and a key reason Protestants removed it from their canon during the Reformation.",
    quote: "It is a holy and wholesome thought to pray for the dead, that they may be loosed from their sins. — 2 Maccabees 12:46",
    sources: ["2 Maccabees", "Goldstein, II Maccabees (Anchor Bible)"],
    relatedEvents: ["1 Maccabees", "Maccabean Revolt", "Council of Trent"]
  },
  {
    year: -50, label: "Wisdom of Solomon", type: "writing-deuterocanon", category: "books", subcategory: "deuterocanonical-books", wiki: "Book_of_Wisdom",
    attributed: "Solomon (literary device — the book is pseudepigraphic)",
    scholarly: "Unknown Alexandrian Jewish author, mid-1st century BCE",
    dispute: "Universally recognized as pseudepigraphic. Not in Jewish or Protestant canons; in Catholic and Orthodox.",
    detail: "Written in Greek (not translated from Hebrew), this philosophical meditation on divine Wisdom personified as a cosmic figure bridges Jewish theology and Greek philosophy. The author, writing as 'Solomon,' argues that wisdom — not military power or wealth — is the path to immortality. Chapters 1–5 address the fate of the righteous vs. the wicked; chapters 6–9 praise Lady Wisdom; chapters 10–19 retell the Exodus as a wisdom narrative. Its influence on Paul (especially Romans 1) and the author of Hebrews is widely recognized by scholars.",
    significance: "The clearest bridge between Jewish and Greek thought in the biblical tradition. Its concept of Wisdom as a divine intermediary directly shaped early Christology.",
    quote: "Wisdom is a breath of the power of God, and a pure emanation of the glory of the Almighty. — Wisdom 7:25",
    sources: ["Wisdom of Solomon", "Winston, The Wisdom of Solomon (Anchor Bible)"],
    relatedEvents: ["Septuagint Begins", "Hebrews", "Paul's Major Letters"]
  },
  {
    year: -150, endYear: -50, label: "Baruch", type: "writing-deuterocanon", category: "books", subcategory: "deuterocanonical-books", wiki: "Book_of_Baruch",
    storyStart: -586, storyEnd: -586,
    attributed: "Baruch ben Neriah, scribe of Jeremiah",
    scholarly: "Unknown, probably 2nd–1st century BCE, composite authorship",
    dispute: "Moderate — clearly not by the historical Baruch. Not in Jewish or Protestant canons; in Catholic and Orthodox.",
    detail: "Attributed to Jeremiah's faithful scribe Baruch, this short book is actually a composite work: a prose confession of sins (1:15–3:8) echoing Daniel 9, a wisdom poem (3:9–4:4) reminiscent of Job 28, and a prophetic poem of comfort (4:5–5:9) modeled on Second Isaiah. It presents itself as written from Babylon during the exile, but its actual composition is much later. The Catholic and Orthodox canons include it alongside Jeremiah; Protestants exclude it.",
    significance: "Illustrates pseudepigraphy at work in the OT tradition — a later author writing under a revered name to extend and apply that figure's message to new circumstances.",
    quote: "Take courage, my children, cry to God, and he will deliver you from the power of the enemy. — Baruch 4:21",
    sources: ["Baruch", "Moore, Daniel, Esther, and Jeremiah: The Additions (Anchor Bible)"],
    relatedEvents: ["Jeremiah & Ezekiel", "Septuagint Begins"]
  },

  /* ═══════════════ NT WRITINGS ═══════════════ */
  {
    year: 48, endYear: 51, label: "Paul's Early Letters", type: "writing-nt", category: "books", subcategory: "pauline-epistles", wiki: "Pauline_epistles",
    attributed: "Paul",
    scholarly: "Paul — no dispute",
    dispute: "Very low — 'undisputed seven'",
    detail: "Galatians and 1 Thessalonians are the earliest surviving Christian documents — written by Paul roughly 15–20 years after the crucifixion, predating the Gospels by at least another decade. Galatians is a fiery defense of Gentile inclusion without circumcision; 1 Thessalonians addresses practical concerns about the expected return of Christ. These belong to what scholars call the 'undisputed seven' — letters whose Pauline authorship is accepted across the theological spectrum.",
    significance: "Our oldest window into Christianity. What Paul assumes his readers already know gives us our earliest snapshot of pre-Gospel Christian belief and practice.",
    quote: "There is neither Jew nor Greek, slave nor free, male nor female; for you are all one in Christ Jesus. — Galatians 3:28",
    sources: ["Galatians", "1 Thessalonians"],
    relatedEvents: ["Conversion of Paul", "Council of Jerusalem", "Paul's Major Letters"]
  },
  {
    year: 53, endYear: 58, label: "Paul's Major Letters", type: "writing-nt", category: "books", subcategory: "pauline-epistles", wiki: "Epistle_to_the_Romans",
    attributed: "Paul",
    scholarly: "Paul — no dispute",
    dispute: "Very low",
    detail: "Romans, 1–2 Corinthians, Philippians, and Philemon form the heart of the Pauline corpus. Romans is Paul's most systematic theological statement, written to a church he has not yet visited. 1–2 Corinthians reveal the messy reality of pastoral leadership — disputes, scandals, and reconciliation. Philippians radiates joy written from prison. Philemon is a brief personal appeal on behalf of a runaway slave. All belong to the 'undisputed seven' and show a remarkably consistent voice, vocabulary, and theological vision.",
    significance: "Romans in particular shaped Christian theology more than any book after the Gospels — driving Augustine, Luther, Calvin, Barth, and ongoing reformations.",
    quote: "The righteous shall live by faith. — Romans 1:17",
    sources: ["Romans", "1–2 Corinthians", "Philippians", "Philemon"],
    relatedEvents: ["Paul's Early Letters", "Deutero-Pauline Letters"]
  },
  {
    year: 60, endYear: 80, label: "Hebrews", type: "writing-nt", category: "books", subcategory: "general-epistles", wiki: "Epistle_to_the_Hebrews",
    attributed: "Paul (some); anonymous in text",
    scholarly: "Unknown — Origen: 'Only God knows.' Candidates: Barnabas, Apollos, Priscilla.",
    dispute: "High — Priscilla theory: woman's name may have been removed",
    detail: "An anonymous letter-sermon that presents Jesus as the ultimate High Priest whose sacrifice makes the Jewish Temple system obsolete. The Greek is the most polished in the New Testament — more sophisticated than Paul's — and the argument moves through intricate typological readings of the Old Testament. Origen famously said 'only God knows' who wrote it. Candidates have included Barnabas, Apollos, Luke, and (intriguingly) Priscilla, whose name may have been removed to preserve the letter's authority in a patriarchal culture.",
    significance: "Nearly excluded from the canon because of its anonymity, Hebrews survives because of its theological brilliance and its traditional (if dubious) attribution to Paul.",
    quote: "Jesus Christ is the same yesterday and today and forever. — Hebrews 13:8",
    sources: ["Hebrews", "Eusebius, Church History 6.25", "Hoppin, Priscilla's Letter"],
    relatedEvents: ["Paul's Major Letters", "Athanasius's Letter"]
  },
  {
    year: 62, endYear: 90, label: "James", type: "writing-nt", category: "books", subcategory: "general-epistles", wiki: "Epistle_of_James",
    attributed: "James, brother of Jesus",
    scholarly: "Debated — polished Greek complicates it",
    dispute: "Moderate — Luther: 'epistle of straw'",
    detail: "A brief letter traditionally attributed to James the brother of Jesus, first leader of the Jerusalem church. Its ethical focus ('faith without works is dead') creates apparent tension with Paul's 'justification by faith,' though most scholars now view them as addressing different questions. Martin Luther famously called it 'an epistle of straw' and relegated it to an appendix in his German Bible. The polished Greek makes direct authorship by the Aramaic-speaking James questionable; it may be by a secretary or a later follower writing in his name.",
    significance: "Preserves a distinctly Jewish-Christian voice in the New Testament, insisting that practical righteousness is inseparable from authentic faith.",
    quote: "Faith by itself, if it has no works, is dead. — James 2:17",
    sources: ["James", "Luther's Preface to the New Testament, 1522"],
    relatedEvents: ["Council of Jerusalem", "Paul's Early Letters", "Luther's Antilegomena"]
  },
  {
    year: 65, endYear: 70, label: "Gospel of Mark", type: "writing-nt", category: "books", subcategory: "gospels",
    storyStart: -5, storyEnd: 30,
    attributed: "John Mark (per Papias)",
    scholarly: "Unknown — anonymous, Papias tradition debated",
    dispute: "Moderate",
    detail: "The shortest and most urgent Gospel, almost universally recognized as the first to be written (~65–70 CE, around the time of or just after the Temple's destruction). Tradition attributes it to John Mark, a companion of Peter, based on a report from Papias (early 2nd century). Mark includes no birth narrative and — in the earliest manuscripts — ends abruptly with the women fleeing the empty tomb in terror, adding no resurrection appearances. The longer endings (Mark 16:9–20) are clearly later additions.",
    significance: "Mark becomes the template — Matthew and Luke both use Mark as their primary source, meaning roughly 90% of Mark appears in Matthew and 65% in Luke.",
    quote: "The beginning of the good news of Jesus Christ, the Son of God. — Mark 1:1",
    sources: ["Mark", "Papias, fragments in Eusebius", "Marcus, Mark (Anchor Bible)"],
    relatedEvents: ["Temple Destroyed", "Matthew & Luke", "Gospel of John"]
  },
  {
    year: 65, endYear: 80, label: "Jude", type: "writing-nt", category: "books", subcategory: "general-epistles", wiki: "Epistle_of_Jude",
    attributed: "Jude, brother of James/Jesus",
    scholarly: "Uncertain",
    dispute: "Moderate — quotes 1 Enoch as authoritative",
    detail: "A fierce short letter attributed to 'Jude, brother of James' — meaning, by implication, brother of Jesus himself. It warns against false teachers who have 'slipped in' to the Christian community and promote licentiousness. Jude remarkably quotes 1 Enoch as authoritative prophecy — a book that never made it into the Jewish or most Christian canons. Its authenticity is debated; some see it as genuinely from the Jesus family, others as pseudonymous.",
    significance: "The Enoch citation was a major stumbling block for canonization. Jude made it in anyway, but 1 Enoch did not.",
    quote: "Enoch, the seventh from Adam, prophesied... — Jude 14",
    sources: ["Jude", "1 Enoch"],
    relatedEvents: ["2 Peter", "Shepherd of Hermas"]
  },
  {
    year: 70, endYear: 85, label: "Deutero-Pauline Letters", type: "writing-nt", category: "books", subcategory: "pauline-epistles", wiki: "Authorship_of_the_Pauline_epistles",
    attributed: "Paul",
    scholarly: "Likely Paul's followers (pseudepigraphy)",
    dispute: "Moderate — Colossians most debated",
    detail: "Colossians, Ephesians, and 2 Thessalonians claim Pauline authorship but show stylistic, vocabulary, and theological differences from the undisputed seven. Most critical scholars consider them written by followers of Paul after his death, a common and non-deceptive ancient practice called pseudepigraphy. Colossians is closest to Paul and most debated; Ephesians reads like an elaborated meditation on Colossians; 2 Thessalonians may be a correction of 1 Thessalonians' apocalyptic expectations. Traditional and conservative scholars maintain Pauline authorship.",
    significance: "These letters represent 'Pauline school' theology — the development of Paul's thought by disciples addressing new situations after his death.",
    quote: "For he is our peace, who has made us both one. — Ephesians 2:14",
    sources: ["Colossians", "Ephesians", "2 Thessalonians", "Ehrman, Forgery and Counterforgery"],
    relatedEvents: ["Paul's Major Letters", "Pastoral Epistles"]
  },
  {
    year: 80, endYear: 90, label: "Matthew & Luke", type: "writing-nt", category: "books", subcategory: "gospels", wiki: "Gospel_of_Matthew",
    storyStart: -6, storyEnd: 30,
    attributed: "Matthew the apostle; Luke the physician",
    scholarly: "Both anonymous — names added 2nd century",
    dispute: "Moderate to high — why would eyewitness Matthew copy Mark?",
    detail: "Both Gospels use Mark as a primary source and share another common source known to scholars as 'Q' (from German Quelle, 'source') — a lost collection of Jesus's sayings. Matthew (~80–90 CE) is the most Jewish Gospel, frequently citing Old Testament prophecies fulfilled in Jesus; it was written for a Jewish-Christian community. Luke (~80–90 CE) is addressed to 'Theophilus' and continues into Acts, forming a two-volume history. Both are anonymous — the traditional attributions (to Matthew the tax collector and Luke the physician) come from 2nd-century church tradition, not the texts themselves.",
    significance: "If Matthew was really an eyewitness, why would he copy from Mark? This question is one of the clearest arguments for the anonymous, non-apostolic authorship of the Gospels.",
    quote: "Many have undertaken to draw up an account of the things that have been fulfilled among us... — Luke 1:1",
    sources: ["Matthew", "Luke", "Acts", "Ehrman, Jesus, Interrupted"],
    relatedEvents: ["Gospel of Mark", "Gospel of John", "Birth of Jesus"]
  },
  {
    year: 80, endYear: 90, label: "1 Peter", type: "writing-nt", category: "books", subcategory: "general-epistles", wiki: "First_Epistle_of_Peter",
    attributed: "Peter, 'through Silvanus'",
    scholarly: "Debated — polished Greek vs. Silvanus as ghostwriter",
    dispute: "Moderate",
    detail: "A letter of encouragement to Christians facing persecution in Asia Minor, traditionally attributed to the apostle Peter writing through Silvanus as secretary. The polished Greek raises questions — could a Galilean fisherman write this? — but ancient use of secretaries (amanuenses) could account for the quality. The letter draws on baptismal themes and presents suffering as participation in Christ's own suffering.",
    significance: "A key witness to how early Christians interpreted persecution theologically — not as divine abandonment but as identification with the crucified Christ.",
    quote: "Cast all your anxiety on him, because he cares for you. — 1 Peter 5:7",
    sources: ["1 Peter", "Achtemeier, 1 Peter (Hermeneia)"],
    relatedEvents: ["Nero's Persecution", "2 Peter"]
  },
  {
    year: 80, endYear: 100, label: "1, 2, 3 John", type: "writing-nt", category: "books", subcategory: "general-epistles", wiki: "Johannine_epistles",
    attributed: "John the Apostle; 'the Elder'",
    scholarly: "Same author, probably not Gospel of John's author",
    dispute: "Moderate",
    detail: "Three short letters sharing vocabulary, style, and theological concerns with the Gospel of John — but probably not by the same author. 1 John is a community-wide letter addressing a schism; 2 and 3 John are brief personal notes. The author identifies himself only as 'the Elder.' The central concerns are love as the mark of authentic discipleship, resistance to false teachers who denied Jesus's full humanity (early Docetism), and the test of orthodoxy by both creed and conduct.",
    significance: "These letters give a rare window into the internal conflicts of early Christian communities — showing that doctrinal splits and authority disputes are as old as the faith.",
    quote: "God is love, and whoever lives in love lives in God. — 1 John 4:16",
    sources: ["1–3 John", "Brown, The Epistles of John (Anchor Bible)"],
    relatedEvents: ["Gospel of John"]
  },
  {
    year: 90, endYear: 100, label: "Gospel of John", type: "writing-nt", category: "books", subcategory: "gospels",
    storyStart: -6, storyEnd: 30,
    attributed: "John son of Zebedee; 'Beloved Disciple'",
    scholarly: "'Johannine community' product. Multiple editing stages.",
    dispute: "High — Beloved Disciple: John? Lazarus? Symbolic?",
    detail: "Radically different from the Synoptics — Matthew, Mark, and Luke — in style, theology, and chronology. John opens with a cosmic prologue identifying Jesus as the eternal Word (Logos). Jesus speaks in extended theological discourses rather than parables. His ministry spans three Passovers, not one. Most scholars see John as the product of a 'Johannine community' that edited and developed the Gospel over time. The mysterious 'Beloved Disciple' is its presumed source, though whether this is the apostle John, Lazarus, or a symbolic figure remains debated.",
    significance: "John provides the most developed Christology in the NT — and contains the most vivid portrayal of Mary Magdalene, including her role as first witness to the resurrection.",
    quote: "In the beginning was the Word, and the Word was with God, and the Word was God. — John 1:1",
    sources: ["John", "Brown, The Gospel According to John (Anchor Bible)"],
    relatedEvents: ["Gospel of Mark", "Matthew & Luke", "Crucifixion & Resurrection"]
  },
  {
    year: 90, endYear: 96, label: "Revelation", type: "writing-nt", category: "books", subcategory: "apocalyptic-book", wiki: "Book_of_Revelation",
    attributed: "John (self-identified)",
    scholarly: "Prophet named John — NOT Gospel's author (different Greek)",
    dispute: "Moderate — nearly excluded from Eastern canon",
    detail: "A vivid apocalyptic vision written by a prophet named John (probably not the same John as the Gospel or letters — the Greek is notably different). Composed on the island of Patmos during a period of persecution (traditionally under Domitian, ~95 CE), Revelation draws on Daniel and Ezekiel to depict the cosmic triumph of the Lamb over the beasts of empire. It was the most disputed book in the NT canon — rejected by many Eastern churches for centuries and still excluded from Orthodox lectionaries today.",
    significance: "The only apocalyptic book in the NT canon, and therefore the primary biblical source for Christian eschatology and art. Its inclusion was never inevitable.",
    quote: "Behold, I stand at the door and knock. — Revelation 3:20",
    sources: ["Revelation", "Eusebius, Church History 3.25"],
    relatedEvents: ["Daniel Written", "Nero's Persecution", "Athanasius's Letter"]
  },
  {
    year: 90, endYear: 110, label: "Pastoral Epistles", type: "writing-nt", category: "books", subcategory: "pauline-epistles", wiki: "Pastoral_epistles",
    attributed: "Paul",
    scholarly: "Unknown, writing in Paul's name a generation later",
    dispute: "High consensus against Paul — 1 Tim 2:12 contradicts Romans 16",
    detail: "1 Timothy, 2 Timothy, and Titus are letters of pastoral instruction addressed to Paul's younger colleagues. Critical scholarship overwhelmingly judges them pseudonymous — written by a later follower in Paul's name. The vocabulary differs markedly from the undisputed seven (306 unique words), the church structure they describe (bishops, deacons, widows' orders) reflects a more developed institutional setting, and the theological emphases are distinctive. Most significantly, 1 Timothy 2:12's restriction on women teaching directly contradicts Paul's own acknowledgment in Romans 16 of women church leaders like Phoebe and Junia.",
    significance: "Their contested authorship matters enormously for debates about church authority and women's roles — whether the 'Paul' quoted here is really Paul.",
    quote: "I do not permit a woman to teach or to assume authority over a man. — 1 Timothy 2:12",
    sources: ["1–2 Timothy", "Titus", "Romans 16", "Ehrman, Forged"],
    relatedEvents: ["Paul's Major Letters", "Deutero-Pauline Letters"]
  },
  {
    year: 100, endYear: 120, label: "2 Peter", type: "writing-nt", category: "books", subcategory: "general-epistles", wiki: "Second_Epistle_of_Peter",
    attributed: "Peter",
    scholarly: "Almost certainly pseudonymous — MOST doubted NT authorship",
    dispute: "Very high — borrows Jude, different Greek, calls Paul 'scripture'",
    detail: "Almost universally judged by critical scholars as the latest book in the New Testament, probably written around 100–120 CE — long after Peter's death. The evidence against Petrine authorship is unusually strong: 2 Peter borrows heavily from Jude (problematic since Peter was senior); its Greek is entirely different from 1 Peter; and it refers to Paul's letters as 'scripture' (2 Peter 3:16) — a concept that developed only after the first century. Even conservative scholars often grant that 2 Peter is the NT's most contested book for authorship.",
    significance: "The last NT book to be written — and the one whose inclusion in the canon was most hesitantly approved by early church writers.",
    quote: "Our beloved brother Paul wrote to you... which the ignorant twist to their own destruction, as they do the other scriptures. — 2 Peter 3:15–16",
    sources: ["2 Peter", "Jude", "Bauckham, Jude, 2 Peter (WBC)"],
    relatedEvents: ["Jude", "Paul's Major Letters"]
  },

  /* ═══════════════ NON-CANONICAL WRITINGS ═══════════════ */
  {
    year: 50, endYear: 120, label: "Gospel of Thomas", type: "writing-noncanon", category: "books", subcategory: "non-canonical",
    attributed: "Didymus Judas Thomas",
    scholarly: "Unknown, likely Syrian community",
    dispute: "Attribution not literal. Excluded: no resurrection, Gnostic, limited circulation.",
    detail: "A collection of 114 sayings of Jesus — with no narrative framework, no miracles, no crucifixion, no resurrection. Discovered in its complete form at Nag Hammadi in 1945 (earlier Greek fragments were already known). Some sayings parallel the Synoptics; others are distinctive and reflect a more mystical, possibly proto-Gnostic orientation. Dated anywhere from the mid-first to mid-second century — scholars radically disagree. Famously concludes with Peter demanding Mary Magdalene leave the company 'because women are not worthy of life,' prompting Jesus's cryptic defense of her.",
    significance: "The most important non-canonical gospel. Its existence demonstrates how varied early Christian literature was — and its sayings continue to intrigue scholars looking for authentic Jesus tradition.",
    quote: "The kingdom is inside of you and it is outside of you. — Gospel of Thomas, saying 3",
    sources: ["Nag Hammadi Library", "Meyer, The Gospel of Thomas"],
    relatedEvents: ["Nag Hammadi Library Discovery", "Gospel of Mary", "Gospel of Judas"]
  },
  {
    year: 100, endYear: 160, label: "Gospel of Mary", type: "writing-noncanon", category: "books", subcategory: "non-canonical",
    attributed: "No author named",
    scholarly: "Unknown, community honoring Mary Magdalene",
    dispute: "No authorship debate. Excluded: late, Gnostic cosmology.",
    detail: "A fragmentary 2nd-century text in which Mary Magdalene receives a private revelation from the risen Jesus and shares it with the other disciples. Peter challenges whether Jesus would really speak privately to a woman; Levi defends her, saying 'the Savior knew her very well — that is why he loved her more than us.' The text survives only in partial manuscripts (roughly half is missing). It never circulated widely and was excluded from canonical consideration primarily because of its late date and Gnostic cosmology.",
    significance: "Preserves an ancient alternative tradition of Mary Magdalene as spiritual authority — a portrayal the canonical Gospels hint at but suppress.",
    quote: "The Savior knew her very well. That is why he loved her more than us. — Gospel of Mary 18",
    sources: ["Berlin Gnostic Codex", "King, The Gospel of Mary of Magdala"],
    relatedEvents: ["Gospel of Thomas", "Gospel of John", "Nag Hammadi Library Discovery"]
  },
  {
    year: 100, endYear: 150, label: "Didache", type: "writing-noncanon", category: "books", subcategory: "non-canonical",
    attributed: "'Teaching of the Twelve'",
    scholarly: "Community document — 'Two Ways' may be very early",
    dispute: "Excluded: no apostolic author. Athanasius: 'useful reading.'",
    detail: "The 'Teaching of the Twelve Apostles' — a short early Christian manual on ethics (the 'Two Ways' of life and death), baptism, fasting, the Eucharist, and how to distinguish true from false prophets. The Two Ways material may be extremely early — possibly first century. The full work was lost for over a thousand years until rediscovered in 1873 in a Greek manuscript. Some early church fathers quoted it as scripture; Athanasius listed it among books 'useful for reading' but outside the canon.",
    significance: "Our clearest window into the actual religious practices of a first/second-century Christian community — liturgies and ethics rather than theology.",
    quote: "There are two ways, one of life and one of death, and there is a great difference between the two ways. — Didache 1:1",
    sources: ["Codex Hierosolymitanus (1873)", "Niederwimmer, The Didache (Hermeneia)"],
    relatedEvents: ["Shepherd of Hermas", "Athanasius's Letter"]
  },
  {
    year: 100, endYear: 160, label: "Gospel of Peter", type: "writing-noncanon", category: "books", subcategory: "non-canonical",
    attributed: "Peter ('I, Simon Peter')",
    scholarly: "Pseudonymous — depends on canonical Gospels",
    dispute: "No defense. Serapion banned it. Excluded: late, legendary, docetic.",
    detail: "A fragmentary passion narrative discovered in an Egyptian grave in 1886–87. Known primarily from Eusebius's earlier reference: Bishop Serapion of Antioch initially allowed it in his church around 200 CE, then banned it after reading more carefully and finding docetic tendencies — the view that Jesus only appeared to suffer. The text contains striking legendary embellishments, including a giant Jesus emerging from the tomb with a cross that speaks.",
    significance: "Demonstrates how early the line between 'useful' and 'heretical' texts was actively policed — sometimes by the same bishop who later changed his mind.",
    quote: "They heard a voice from the heavens saying, 'Have you preached to them that sleep?' And the answer was heard from the cross: 'Yes.' — Gospel of Peter 10",
    sources: ["Akhmim fragment (1886)", "Eusebius, Church History 6.12"],
    relatedEvents: ["Gospel of Thomas", "Irenaeus: Four Gospels"]
  },
  {
    year: 140, endYear: 160, label: "Gospel of Judas", type: "writing-noncanon", category: "books", subcategory: "non-canonical",
    attributed: "No author named",
    scholarly: "Sethian Gnostic author",
    dispute: "Clearly 2nd-century. Excluded: late, Gnostic.",
    detail: "A Coptic text published only in 2006 after decades of neglect by private collectors, in which Judas is portrayed as Jesus's most trusted disciple — the only one who truly understands him. Jesus asks Judas to betray him so that the divine spark imprisoned in Jesus's body can be released. The text is clearly 2nd-century Sethian Gnostic literature, not a historically reliable source. Its sensational publication attracted enormous media attention but minimal scholarly support for rehabilitating the historical Judas.",
    significance: "A reminder that 'lost gospels' don't necessarily contain earlier or more authentic history — they're often later theological experiments.",
    quote: "You will exceed all of them. For you will sacrifice the man that clothes me. — Gospel of Judas",
    sources: ["Codex Tchacos", "Kasser et al., The Gospel of Judas"],
    relatedEvents: ["Gospel of Thomas", "Irenaeus: Four Gospels"]
  },
  {
    year: 140, endYear: 155, label: "Shepherd of Hermas", type: "writing-noncanon", category: "books", subcategory: "non-canonical",
    attributed: "Hermas, layperson in Rome",
    scholarly: "Hermas — rare accepted attribution",
    dispute: "Issue: layperson, not apostle. Closest 'near miss' — in Codex Sinaiticus.",
    detail: "A series of visions, commandments, and parables experienced by a freed slave named Hermas living in Rome, addressing questions of repentance after baptism. Rarely among non-canonical works, the traditional authorship attribution is generally accepted — Hermas was a real person. The book was enormously popular in early Christianity and appears in the 4th-century Codex Sinaiticus alongside the canonical books. Its exclusion from the canon turned on one point: Hermas was a layperson, not an apostle or their direct associate.",
    significance: "The closest 'near miss' for canonization. Its popularity shows how porous the boundary between canonical and beloved-but-not-canonical really was.",
    quote: "First of all, believe that God is one. — Shepherd of Hermas, Mandate 1",
    sources: ["Codex Sinaiticus", "Osiek, Shepherd of Hermas (Hermeneia)"],
    relatedEvents: ["Athanasius's Letter", "Didache"]
  },
  {
    year: 130, endYear: 150, label: "Infancy Gospel of Thomas", type: "writing-noncanon", category: "books", subcategory: "non-canonical",
    attributed: "Thomas the Israelite",
    scholarly: "Unknown, unconnected to Gospel of Thomas",
    dispute: "No defense. Excluded: legendary.",
    detail: "A collection of miracle stories about Jesus as a child, unrelated to the more famous Gospel of Thomas. The young Jesus forms clay birds that fly away when clapped at, curses a boy who bumps him (killing him), and strikes his teacher when scolded for bad behavior. The text is pure legend — written in the 2nd century to fill the gap between Jesus's birth and adult ministry. No serious voice in early Christianity argued for its canonicity.",
    significance: "Shows the popular hunger for stories about Jesus's hidden years — and the early church's willingness to reject texts that failed the test of historical and theological plausibility.",
    quote: "If you are a god, speak a word and the child will live. And immediately the child lived. — Infancy Gospel of Thomas 9",
    sources: ["Various Greek, Syriac, and Latin manuscripts", "Ehrman, Lost Scriptures"],
    relatedEvents: ["Gospel of Thomas", "Irenaeus: Four Gospels"]
  },

  /* ═══════════════ CANON EVENTS ═══════════════ */
  {
    year: 90, endYear: 100, label: "Council of Jamnia", type: "canon", category: "canon-formation", subcategory: "jewish-canon", wiki: "Council_of_Jamnia",
    detail: "Traditional shorthand for rabbinic discussions at Yavneh (in Hebrew) in the late first century CE about which Hebrew books belong to scripture. Older Jewish and Christian scholarship imagined a formal 'council' that closed the Jewish canon — that picture has been almost entirely abandoned. What actually occurred was a gradual rabbinic conversation lasting generations, debating books like Ecclesiastes, Song of Solomon, and Esther. By around 200 CE the canon of the Hebrew Bible was effectively stable.",
    significance: "Represents the real, messy process of canon formation — not a single decisive meeting but ongoing community discernment.",
    quote: "All the holy scriptures render the hands unclean. — Mishnah Yadayim 3:5",
    sources: ["Mishnah Yadayim", "McDonald, The Biblical Canon"],
    relatedEvents: ["Temple Destroyed", "Bar Kokhba Revolt"]
  },
  {
    year: 140, label: "Marcion's Canon", type: "canon", category: "canon-formation", subcategory: "early-christian-canon", wiki: "Marcion_of_Sinope",
    detail: "Marcion of Sinope, a wealthy Christian teacher in Rome, produces the first known attempt at a Christian canon around 140 CE. Convinced the God of the Hebrew Bible was a lesser, vengeful deity distinct from Jesus's Father, Marcion rejected the entire Old Testament and accepted only an edited version of Luke and ten edited Paul letters (no Pastorals, no Hebrews). The mainstream church condemned his views as heresy, but his action forced everyone else to define their own canon in response.",
    significance: "Without Marcion's provocation, the orthodox canon might have formed much more slowly. He is, ironically, the father of the canon he was excommunicated for attacking.",
    quote: "Marcion removed from the Gospel everything opposed to his views. — Tertullian, Against Marcion 4.6",
    sources: ["Tertullian, Against Marcion", "Irenaeus, Against Heresies"],
    relatedEvents: ["Muratorian Fragment", "Irenaeus: Four Gospels"]
  },
  {
    year: 170, endYear: 180, label: "Muratorian Fragment", type: "canon", category: "canon-formation", subcategory: "early-christian-canon", wiki: "Muratorian_fragment",
    detail: "A damaged 7th-century Latin manuscript in the Ambrosian Library of Milan that preserves what appears to be the earliest surviving list of books accepted by a major Christian community — most scholars date the underlying Greek original to the late 2nd century in Rome. The fragment accepts four Gospels, Acts, 13 Paul letters (no Hebrews), Jude, 1–2 John, Revelation, and Wisdom of Solomon. It rejects the Shepherd of Hermas only because it is too recent to be apostolic. Notably absent: Hebrews, James, 1–2 Peter.",
    significance: "Our earliest snapshot of canon-in-formation — showing that consensus on the core was much earlier than on the edges.",
    quote: "The fourth Gospel is that of John, one of the disciples. — Muratorian Fragment",
    sources: ["Muratorian Fragment (Ambrosian Codex)", "Metzger, The Canon of the New Testament"],
    relatedEvents: ["Marcion's Canon", "Irenaeus: Four Gospels"]
  },
  {
    year: 180, endYear: 200, label: "Irenaeus: Four Gospels", type: "canon", category: "canon-formation", subcategory: "early-christian-canon", wiki: "Irenaeus",
    detail: "Bishop Irenaeus of Lyon, in his massive work Against Heresies (~180 CE), makes the first strong theological argument that there must be exactly four Gospels — not more, not fewer. His reasons are characteristically creative: there are four winds, four zones of the earth, and four pillars of the church, so there must be four Gospels. Underlying this symbolism is a serious concern to distinguish the apostolic Gospels from the flood of Gnostic and other non-canonical gospels circulating at the time.",
    significance: "Fixes the four-Gospel standard that would define Christian orthodoxy for the next two millennia.",
    quote: "It is not possible that the Gospels can be either more or fewer in number than they are. — Irenaeus, Against Heresies 3.11.8",
    sources: ["Irenaeus, Against Heresies 3.11"],
    relatedEvents: ["Marcion's Canon", "Muratorian Fragment"]
  },
  {
    year: 250, endYear: 280, label: "Origen's Classifications", type: "canon", category: "canon-formation", subcategory: "early-christian-canon", wiki: "Origen",
    detail: "Origen of Alexandria, the most learned Christian scholar of his age, develops a three-tier classification of early Christian writings: 'acknowledged' (universally accepted), 'disputed' (widely read but contested), and 'spurious' or 'false' (to be rejected). His acknowledged list matches most of what would become the final canon. His disputed list includes Hebrews, James, 2 Peter, 2–3 John, Jude, Revelation, and the Shepherd of Hermas. His approach becomes the working framework for canon discernment for the next century.",
    significance: "Replaces the earlier binary (apostolic or not) with a more realistic three-tier model acknowledging the messy middle.",
    quote: "Who wrote the epistle, in truth God knows. — Origen on Hebrews",
    sources: ["Eusebius, Church History 6.25 (quoting Origen)"],
    relatedEvents: ["Muratorian Fragment", "Eusebius's Categories"]
  },
  {
    year: 313, endYear: 331, label: "Eusebius's Categories", type: "canon", category: "canon-formation", subcategory: "early-christian-canon", wiki: "Eusebius",
    detail: "Eusebius of Caesarea, the first major church historian, refines Origen's classification in his Church History (early 4th century) into four categories: 'accepted' (homologoumena), 'disputed' (antilegomena — widely read but contested), 'spurious' (notha — clearly not apostolic), and 'heretical.' His accepted list matches what would become the final 27. His disputed list includes James, Jude, 2 Peter, 2–3 John, and (remarkably) Revelation.",
    significance: "The most influential pre-Athanasian taxonomy of Christian books. Many works he placed as disputed would take another century to be fully accepted.",
    quote: "Among the disputed books... are those called the Epistle of James and that of Jude. — Eusebius, Church History 3.25",
    sources: ["Eusebius, Church History 3.25"],
    relatedEvents: ["Origen's Classifications", "Athanasius's Letter"]
  },
  {
    year: 363, label: "Synod of Laodicea", type: "canon", category: "canon-formation", subcategory: "council-decisions", wiki: "Council_of_Laodicea",
    detail: "A regional council in Asia Minor produces Canon 60, which lists 26 New Testament books — everything that would become canonical except Revelation. The omission of Revelation reflects the book's long uncertain status in the Eastern churches. The Laodicean list is very close to but not identical with the later Athanasian list, showing the canon was still in flux in the East even as it was consolidating in the West.",
    significance: "A reminder that canon formation was not a single act but a centuries-long convergence, with Revelation the last major book to gain full acceptance.",
    quote: "These are all the books of the Old Testament appointed to be read... — Council of Laodicea, Canon 60",
    sources: ["Council of Laodicea, Canon 60", "Metzger, The Canon of the New Testament"],
    relatedEvents: ["Athanasius's Letter", "Revelation"]
  },
  {
    year: 367, label: "Athanasius's Letter", type: "canon", category: "canon-formation", subcategory: "council-decisions", wiki: "Athanasius_of_Alexandria",
    detail: "Bishop Athanasius of Alexandria, in his 39th Festal Letter of 367 CE, provides the first known list that exactly matches the 27-book New Testament canon — no more, no fewer. He writes to define the books appropriate for liturgical reading and to resist heretical alternatives. The letter also lists 22 books for the Old Testament and rejects adding or subtracting from either. This is the closest anyone can point to a 'definitive moment' for the NT canon.",
    significance: "The single most important canon document. For the first time, the exact 27 books appear together as authoritative.",
    quote: "Let no one add to these; let nothing be taken away from them. — Athanasius, Festal Letter 39",
    sources: ["Athanasius, 39th Festal Letter", "Ehrman, Lost Christianities"],
    relatedEvents: ["Eusebius's Categories", "Council of Rome", "Council of Carthage"]
  },
  {
    year: 382, label: "Council of Rome", type: "canon", category: "canon-formation", subcategory: "council-decisions", wiki: "Council_of_Rome",
    detail: "Under Pope Damasus I, the Roman synod of 382 CE endorses the same 27 NT books Athanasius had listed 15 years earlier, along with the longer Old Testament including the deuterocanonical books (Tobit, Judith, Wisdom, Sirach, 1–2 Maccabees, and additions to Esther and Daniel). This becomes the basis for the Latin Vulgate canon that Jerome is commissioned to translate at the same council.",
    significance: "Fixes the Roman Catholic canon definitively. Every book in today's Catholic Bible was approved here.",
    quote: "The order of the scriptures of the New and Eternal Testament... — Decree of Damasus",
    sources: ["Decretum Gelasianum", "McDonald, The Biblical Canon"],
    relatedEvents: ["Athanasius's Letter", "Jerome's Vulgate", "Council of Hippo"]
  },
  {
    year: 393, label: "Council of Hippo", type: "canon", category: "canon-formation", subcategory: "council-decisions",
    detail: "A regional North African council presided over by Bishop Aurelius of Carthage, with Augustine (then a young priest) in attendance. Canon 36 of the council's decrees affirms the same 27-book New Testament as Athanasius and Rome. The council's authority was regional rather than universal, but its canon list became the working standard for the Latin West.",
    significance: "Confirms the emerging Latin consensus on the canon, with Augustine's implicit endorsement lending it enormous subsequent authority.",
    quote: "These are the canonical scriptures which the fathers confined within the canon. — Council of Hippo, Canon 36",
    sources: ["Council of Hippo, Canon 36", "Augustine, On Christian Doctrine 2"],
    relatedEvents: ["Athanasius's Letter", "Council of Carthage"]
  },
  {
    year: 397, label: "Council of Carthage", type: "canon", category: "canon-formation", subcategory: "council-decisions", wiki: "Councils_of_Carthage",
    detail: "A follow-up North African council reaffirms the canon list of Hippo, providing what many historians cite as the 'closing' of the New Testament canon in the Latin West. Augustine is now a bishop and actively involved. The council's canon list matches Hippo exactly and becomes the received canon for the entire Western church until the Reformation.",
    significance: "Often cited (somewhat loosely) as the moment the canon was 'closed.' In reality, it simply ratified what had been emerging for two centuries.",
    quote: "Besides the canonical scriptures, nothing shall be read in the church under the name of the divine scriptures. — Council of Carthage, Canon 24",
    sources: ["Council of Carthage (397)", "Augustine, On Christian Doctrine"],
    relatedEvents: ["Council of Hippo", "Athanasius's Letter", "Council of Trent"]
  },
  {
    year: 405, label: "Jerome's Vulgate", type: "canon", category: "canon-formation", subcategory: "council-decisions", wiki: "Vulgate",
    detail: "Commissioned by Pope Damasus in 382, Jerome produces a fresh Latin translation of the Bible directly from Hebrew (OT) and Greek (NT), replacing the earlier patchwork of 'Old Latin' translations. Jerome works for over two decades, much of it in Bethlehem. Controversially, he insists on translating the Old Testament from the Hebrew veritas hebraica rather than the Greek Septuagint — a choice Augustine publicly criticized. The Vulgate becomes the standard Bible of Western Christianity for more than a thousand years and was declared authoritative by the Council of Trent.",
    significance: "The single most influential Bible translation in Christian history. Shaped Western theological vocabulary, liturgy, and biblical imagination for a millennium.",
    quote: "Ignorance of Scripture is ignorance of Christ. — Jerome, Commentary on Isaiah",
    sources: ["Jerome's Vulgate", "Kelly, Jerome: His Life, Writings, and Controversies"],
    relatedEvents: ["Council of Rome", "Council of Trent"]
  },
  {
    year: 900, label: "Masoretic Text", type: "canon", category: "canon-formation", subcategory: "jewish-canon",
    detail: "Jewish scribal scholars in Tiberias (notably the Ben Asher family) complete the system of vowel markings, cantillation marks, and marginal notes that fixes the Hebrew Bible text in the form used ever since. Before the Masoretes, Hebrew was written without vowels, and many pronunciations (and therefore meanings) were ambiguous. The Aleppo Codex (~930) and the Leningrad Codex (1008) are the two most important complete Masoretic manuscripts. Nearly all modern Hebrew Bible editions derive from the Leningrad Codex.",
    significance: "Preserves with extraordinary precision the Hebrew Bible text that all subsequent Jewish and Protestant Christian Old Testaments rely on.",
    quote: "If one letter is added or subtracted, it can destroy the whole world. — Rabbinic saying on scribal accuracy",
    sources: ["Aleppo Codex", "Leningrad Codex", "Tov, Textual Criticism of the Hebrew Bible"],
    relatedEvents: ["Priestly Source & Torah", "Dead Sea Scrolls Discovery"]
  },
  {
    year: 1522, label: "Luther's Antilegomena", type: "canon", category: "canon-formation", subcategory: "reformation-canon", wiki: "Antilegomena",
    detail: "Martin Luther's German New Testament places Hebrews, James, Jude, and Revelation at the end, separated from the other books, reflecting his judgment that their apostolic authority was doubtful. In his preface, he famously calls James 'an epistle of straw' for its apparent contradiction of Paul on justification. Luther also separates the Old Testament apocrypha into a distinct section labeled 'books which are not to be held equal to the Holy Scriptures, but are useful and good to read.' Though Luther's German translation remained hugely influential, subsequent Protestant Bibles reintegrated the four NT books.",
    significance: "Reopens the question of canon a millennium after Carthage — and establishes the Protestant pattern of distinguishing 'canonical' from 'apocryphal' Old Testament books.",
    quote: "St. James's epistle is really an epistle of straw, compared to these others, for it has nothing of the nature of the Gospel about it. — Luther, Preface to the New Testament (1522)",
    sources: ["Luther's September Testament (1522)", "Luther, Prefaces to the New Testament"],
    relatedEvents: ["James", "Council of Trent", "Westminster Confession"]
  },
  {
    year: 1546, label: "Council of Trent", type: "canon", category: "canon-formation", subcategory: "reformation-canon",
    detail: "In response to the Protestant Reformation, the Catholic Council of Trent (1545–1563) formally and authoritatively defines the Catholic biblical canon for the first time in Church history — binding under pain of anathema. The canon affirmed exactly matches Hippo/Carthage: 46 Old Testament books (including the deuterocanonicals Protestants were now calling 'apocrypha') and 27 New Testament books. Trent also affirms the Latin Vulgate as the authoritative edition for the Catholic Church.",
    significance: "The first ecumenical (rather than regional) council to formally define the canon. This is why Catholic and Protestant Bibles differ in OT content today.",
    quote: "If anyone does not receive, as sacred and canonical, the said books entire with all their parts... let him be anathema. — Council of Trent, Session 4",
    sources: ["Council of Trent, Session 4 (1546)"],
    relatedEvents: ["Luther's Antilegomena", "Westminster Confession", "Council of Carthage"]
  },
  {
    year: 1647, label: "Westminster Confession", type: "canon", category: "canon-formation", subcategory: "reformation-canon", wiki: "Westminster_Confession_of_Faith",
    detail: "An assembly of English and Scottish Puritan theologians meeting at Westminster Abbey produces a confessional statement that explicitly defines the 66-book Protestant canon — 39 Old Testament books (matching the Hebrew Bible, excluding the deuterocanonicals) plus 27 New Testament. The apocrypha are declared 'not of divine inspiration' and granted no more authority than other human writings. Together with Trent a century earlier, Westminster finalizes the division between Protestant and Catholic Bibles that persists today.",
    significance: "Fixes the Protestant canon as 66 books. For the first time in history, Western Christianity now has two officially competing canons.",
    quote: "The books commonly called Apocrypha... are not to be any otherwise approved, or made use of, than other human writings. — Westminster Confession 1.3",
    sources: ["Westminster Confession of Faith (1647)"],
    relatedEvents: ["Council of Trent", "Luther's Antilegomena"]
  },
  {
    year: 1945, label: "Nag Hammadi Library Discovery", type: "canon", category: "canon-formation", subcategory: "modern-discoveries", wiki: "Nag_Hammadi_library",
    detail: "An Egyptian farmer named Muhammad Ali al-Samman uncovers a sealed jar near the town of Nag Hammadi containing 13 leather-bound Coptic codices from the 4th century — a hidden library of early Christian texts, probably buried by monks from a nearby Pachomian monastery after Athanasius's 367 letter declared many such books heretical. The 52 texts include the Gospel of Thomas, the Gospel of Philip, the Gospel of Truth, and the Apocryphon of John, revolutionizing knowledge of early Christian diversity and Gnosticism.",
    significance: "The most important 20th-century discovery for the study of early Christian diversity. Transformed scholarly understanding of 'lost' Christianities that the orthodox tradition had suppressed.",
    quote: "He who will drink from my mouth will become like me. — Gospel of Thomas, saying 108",
    sources: ["Nag Hammadi Codices (Cairo Coptic Museum)", "Robinson, The Nag Hammadi Library"],
    relatedEvents: ["Gospel of Thomas", "Gospel of Mary", "Athanasius's Letter"]
  },
  {
    year: 1947, label: "Dead Sea Scrolls Discovery", type: "canon", category: "canon-formation", subcategory: "modern-discoveries", wiki: "Dead_Sea_Scrolls",
    detail: "A Bedouin shepherd searching for a lost goat throws a stone into a cave near Qumran on the northwest shore of the Dead Sea and hears pottery break. The investigation uncovers the first of what will become over 900 manuscripts and fragments dating from roughly 250 BCE to 70 CE — the library of a Jewish sectarian community, almost certainly the Essenes. Among the finds: the oldest known copies of every Old Testament book except Esther, a thousand years older than any previously known Hebrew manuscripts. The scrolls confirm the extraordinary stability of the Hebrew text while also revealing earlier variant traditions.",
    significance: "The most important manuscript discovery in biblical history. Pushes our direct textual evidence for the Hebrew Bible back a full millennium.",
    quote: "Blessed is the man who walks in the counsel of righteousness. — Great Isaiah Scroll (1QIsaa)",
    sources: ["Qumran manuscripts", "VanderKam, The Dead Sea Scrolls Today"],
    relatedEvents: ["Masoretic Text", "Priestly Source & Torah", "Nag Hammadi Library Discovery"]
  },

  /* ═══════════════ SUPPLEMENTARY BIBLICAL EVENTS ═══════════════ */

  // Creation & Patriarchs
  { year: -3000, endYear: -2500, label: "Noah and the Flood", type: "event", category: "biblical-events", subcategory: "creation-patriarchs", detail: "According to Genesis 6-9, God sends a great flood to cleanse the earth of wickedness, sparing Noah and his family in an ark. The narrative parallels earlier Mesopotamian flood stories such as the Epic of Gilgamesh and the Atrahasis epic. After the waters recede, Noah offers a sacrifice and God establishes a covenant with all living creatures, symbolized by the rainbow. The flood story marks a theological reset in Genesis, establishing the pattern of divine judgment followed by mercy and renewed promise.", wiki: "Genesis_flood_narrative", significance: "The flood narrative introduces the covenant theme that structures the rest of the Bible and provides the template for understanding God's judgment as redemptive rather than purely destructive.", quote: "I establish my covenant with you: Never again will all life be destroyed by the waters of a flood. — Genesis 9:11", sources: ["Genesis 6-9", "Epic of Gilgamesh, Tablet XI"], relatedEvents: ["Patriarchal Period", "Tower of Babel", "Genesis"] },
  { year: -2400, label: "Tower of Babel", type: "event", category: "biblical-events", subcategory: "creation-patriarchs", detail: "Genesis 11 recounts humanity's attempt to build a tower reaching heaven at Babel, understood as an act of collective pride against God. God confuses their language and scatters them across the earth, explaining the diversity of languages and nations. The story serves as an etiological narrative for Babylon and as a bridge between the primeval history and the call of Abraham. Many scholars see it as a critique of Mesopotamian ziggurat culture and imperial ambition.", wiki: "Tower_of_Babel", significance: "The scattering at Babel sets the stage for God's election of Abraham and a single family through whom all nations will eventually be blessed, pivoting Genesis from universal to particular history.", quote: "Come, let us go down and confuse their language so they will not understand each other. — Genesis 11:7", sources: ["Genesis 11:1-9"], relatedEvents: ["Noah and the Flood", "Patriarchal Period", "Genesis"] },
  { year: -2066, label: "Isaac Born", type: "event", category: "biblical-events", subcategory: "creation-patriarchs", detail: "Abraham and Sarah's long-promised son Isaac is born when Abraham is 100 years old, fulfilling the covenant promise made decades earlier. Isaac becomes the child through whom God's promises to Abraham continue, displacing Ishmael as the covenant heir. The near-sacrifice of Isaac on Mount Moriah (the Aqedah) becomes one of the most theologically significant episodes in all of Scripture. Isaac's birth demonstrates the biblical theme that God's purposes often work through the humanly impossible.", wiki: "Isaac", significance: "Isaac's miraculous birth validates God's covenant faithfulness and establishes the lineage through which Israel, David, and ultimately the Messiah will come.", quote: "Is anything too hard for the Lord? I will return to you at the appointed time next year, and Sarah will have a son. — Genesis 18:14", sources: ["Genesis 21", "Genesis 22"], relatedEvents: ["Patriarchal Period", "Jacob and Esau Born", "Genesis"] },
  { year: -2006, label: "Jacob and Esau Born", type: "event", category: "biblical-events", subcategory: "creation-patriarchs", detail: "Twin sons are born to Isaac and Rebekah, with Esau emerging first and Jacob grasping his heel. Their rivalry over the birthright and blessing drives much of the patriarchal narrative in Genesis 25-36. Jacob later wrestles with God at Peniel and is renamed Israel, becoming the ancestor of the twelve tribes. The story illustrates the recurring biblical theme of God choosing the younger or weaker to carry forward the covenant.", wiki: "Jacob", significance: "Jacob's transformation into Israel provides the origin story for the nation and its twelve-tribe structure, foundational to the entire biblical narrative from Exodus onward.", quote: "Two nations are in your womb, and two peoples from within you will be separated; one people will be stronger than the other, and the older will serve the younger. — Genesis 25:23", sources: ["Genesis 25-36"], relatedEvents: ["Isaac Born", "Joseph in Egypt", "Patriarchal Period"] },

  // Egypt & Exodus
  { year: -1885, label: "Joseph in Egypt", type: "event", category: "biblical-events", subcategory: "egypt-exodus", detail: "Sold into slavery by his brothers, Joseph rises to become vizier of Egypt and saves the region from famine. His story in Genesis 37-50 sets the stage for Israel's sojourn in Egypt. Joseph's ability to interpret Pharaoh's dreams elevates him to the second most powerful position in the kingdom. His eventual reconciliation with his brothers demonstrates the theme of God working through human evil to accomplish redemptive purposes.", wiki: "Joseph_(Genesis)", significance: "Joseph's story bridges the patriarchal narratives and the Exodus, explaining how Israel came to be in Egypt and introducing the theme of God's providence working through suffering.", quote: "You intended to harm me, but God intended it for good to accomplish what is now being done, the saving of many lives. — Genesis 50:20", sources: ["Genesis 37-50"], relatedEvents: ["Jacob and Esau Born", "Israel Settles in Egypt", "The Exodus"] },
  { year: -1876, label: "Israel Settles in Egypt", type: "event", category: "biblical-events", subcategory: "egypt-exodus", detail: "Jacob's family of seventy migrates to Egypt at Joseph's invitation during the famine, settling in the fertile land of Goshen. Over the following centuries they multiply into a large population that the Egyptians eventually enslave. This period of growth and oppression sets the conditions for the Exodus, the defining event of Israelite identity. The transition from honored guests to enslaved people marks one of the sharpest reversals in biblical narrative.", wiki: "Israelites_in_Egypt", significance: "The settlement in Egypt begins the four-hundred-year sojourn that shapes Israel's identity as a redeemed people, making the Exodus possible and giving the Torah its central narrative frame.", quote: "Then a new king, to whom Joseph meant nothing, came to power in Egypt. — Exodus 1:8", sources: ["Genesis 46-47", "Exodus 1"], relatedEvents: ["Joseph in Egypt", "The Exodus", "Moses Born"] },
  { year: -1526, label: "Moses Born", type: "event", category: "biblical-events", subcategory: "egypt-exodus", detail: "Moses is born during Pharaoh's decree to kill Hebrew male infants and is rescued by Pharaoh's daughter, who draws him from a basket in the Nile. He is raised in the Egyptian court, receiving an elite education before killing an Egyptian taskmaster and fleeing to Midian. In Midian he spends forty years as a shepherd before encountering God at the burning bush. His unique position between Egyptian and Hebrew worlds prepares him to lead the Exodus and mediate God's covenant.", wiki: "Moses", significance: "Moses is the central human figure of the Torah, serving as liberator, lawgiver, and prophet. His life frames the entire Pentateuch and shapes Israelite religion for centuries.", quote: "I AM WHO I AM. This is what you are to say to the Israelites: I AM has sent me to you. — Exodus 3:14", sources: ["Exodus 1-4"], relatedEvents: ["Israel Settles in Egypt", "The Exodus", "Ten Commandments Given"] },
  { year: -1445, label: "Ten Commandments Given", type: "event", category: "biblical-events", subcategory: "egypt-exodus", detail: "At Mount Sinai, God delivers the Ten Commandments to Moses, forming the core of the Mosaic covenant between God and Israel. The Decalogue becomes the foundation of Israelite law and ethics, covering duties to God and duties to neighbor. Moses receives both the commandments and an extensive body of civil and ceremonial law during the Sinai theophany. The covenant structure mirrors ancient Near Eastern suzerainty treaties, with God as the sovereign and Israel as the vassal.", wiki: "Ten_Commandments", significance: "The Decalogue establishes the moral and legal framework for Israelite society and remains the most recognized summary of biblical ethics in both Jewish and Christian traditions.", quote: "I am the Lord your God, who brought you out of Egypt, out of the land of slavery. You shall have no other gods before me. — Exodus 20:2-3", sources: ["Exodus 20", "Deuteronomy 5"], relatedEvents: ["The Exodus", "Tabernacle Built", "Moses Born"] },
  { year: -1445, label: "Tabernacle Built", type: "event", category: "biblical-events", subcategory: "egypt-exodus", detail: "Israel constructs the portable tabernacle in the wilderness according to detailed instructions in Exodus 25-40, using materials donated by the people. It serves as the center of worship and God's dwelling place among the Israelites during their wilderness wanderings and into the conquest period. The tabernacle's design features concentric zones of increasing holiness, culminating in the Holy of Holies where God's presence dwells above the Ark of the Covenant. Its architecture and rituals prefigure both Solomon's Temple and, in Christian theology, the incarnation.", wiki: "Tabernacle", significance: "The tabernacle establishes the sacrificial worship system central to Torah religion and embodies the theological concept of God dwelling among his people.", quote: "Then have them make a sanctuary for me, and I will dwell among them. — Exodus 25:8", sources: ["Exodus 25-40", "Leviticus 1-7"], relatedEvents: ["Ten Commandments Given", "Solomon & First Temple", "The Exodus"] },

  // Conquest & Judges
  { year: -1406, endYear: -1400, label: "Promised Land Conquered", type: "event", category: "biblical-events", subcategory: "conquest-judges", detail: "Under Joshua's leadership, the Israelites cross the Jordan River and wage a military campaign to conquer Canaan, beginning with the miraculous fall of Jericho. The book of Joshua describes a rapid central campaign followed by northern and southern operations. The conquered land is then divided by lot among the twelve tribes, though many Canaanite enclaves remain unconquered. Archaeological evidence for this period is debated, with some scholars favoring a gradual settlement model over a swift military conquest.", wiki: "Book_of_Joshua", significance: "The conquest fulfills the land promise central to God's covenant with Abraham and establishes Israel as a territorial nation, completing the narrative arc begun in Genesis.", quote: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go. — Joshua 1:9", sources: ["Joshua 1-24", "Judges 1"], relatedEvents: ["The Exodus", "Period of the Judges", "Tabernacle Built"] },
  { year: -1100, label: "Ruth the Moabite", type: "event", category: "biblical-events", subcategory: "conquest-judges", detail: "The story of Ruth, a Moabite woman who pledges loyalty to her Israelite mother-in-law Naomi and eventually marries Boaz, a kinsman-redeemer in Bethlehem. Set during the chaotic period of the judges, the book offers a quiet counterpoint of faithfulness, kindness, and providence. Ruth becomes the great-grandmother of King David, placing a foreign woman in the messianic lineage. The narrative also preserves the legal custom of levirate marriage and land redemption.", wiki: "Book_of_Ruth", significance: "Ruth's inclusion in David's ancestry demonstrates that God's purposes extend beyond ethnic Israel, a theme later central to the New Testament's inclusion of Gentiles.", quote: "Where you go I will go, and where you stay I will stay. Your people will be my people and your God my God. — Ruth 1:16", sources: ["Book of Ruth"], relatedEvents: ["Period of the Judges", "King David's Reign", "Birth of Jesus"] },
  { year: -1090, label: "Samson the Strongman", type: "event", category: "biblical-events", subcategory: "conquest-judges", detail: "Samson, a Nazirite judge endowed with supernatural strength, wages a one-man campaign against the Philistines who dominate Israel during this period. His exploits include killing a lion, slaying a thousand men with a jawbone, and carrying away the gates of Gaza. His relationship with Delilah leads to the loss of his strength, capture, and blinding by the Philistines. His story in Judges 13-16 ends dramatically when he pulls down the temple of Dagon, killing more enemies in his death than in his life.", wiki: "Samson", significance: "Samson embodies both the potential and the failure of the judges period, illustrating how personal unfaithfulness undermines divinely given gifts and foreshadowing Israel's need for a king.", quote: "Then Samson prayed to the Lord, 'Sovereign Lord, remember me. Please, God, strengthen me just once more.' — Judges 16:28", sources: ["Judges 13-16"], relatedEvents: ["Period of the Judges", "Samuel Brings Transition", "Promised Land Conquered"] },

  // United Kingdom
  { year: -1050, label: "Samuel Brings Transition", type: "event", category: "biblical-events", subcategory: "united-kingdom", detail: "The prophet Samuel serves as the last judge of Israel, bridging the tribal period and the monarchy. He anoints both Saul and David as kings at God's direction, though he warns the people that kingship will bring burdensome taxation and conscription. Samuel also establishes schools of prophets, institutionalizing the prophetic voice that will check royal power throughout Israel's history. His career demonstrates the tension between theocracy and monarchy that runs through the Deuteronomistic History.", wiki: "Samuel", significance: "Samuel's ministry establishes the prophetic office as a permanent counterweight to royal power, a dynamic that shapes Israelite religion from this point through the exile.", quote: "Does the Lord delight in burnt offerings and sacrifices as much as in obeying the Lord? To obey is better than sacrifice. — 1 Samuel 15:22", sources: ["1 Samuel 1-16"], relatedEvents: ["Period of the Judges", "Saul Anointed King", "King David's Reign"] },
  { year: -1043, label: "Saul Anointed King", type: "event", category: "biblical-events", subcategory: "united-kingdom", detail: "Saul of the tribe of Benjamin becomes Israel's first king, anointed by Samuel at the people's demand for a ruler like other nations. His early reign is marked by military victories against the Ammonites and Philistines, earning widespread popular support. However, his disobedience regarding the Amalekite ban and his growing jealousy of David lead to his rejection by God through Samuel. Saul's tragic decline ends with his death on Mount Gilboa, leaving a cautionary tale about power and faithfulness.", wiki: "Saul", significance: "Saul's failed kingship establishes the standard by which all subsequent Israelite kings are measured and demonstrates that military prowess without obedience to God is insufficient for leadership.", quote: "You have rejected the word of the Lord, and the Lord has rejected you as king over Israel. — 1 Samuel 15:26", sources: ["1 Samuel 9-31"], relatedEvents: ["Samuel Brings Transition", "King David's Reign", "Period of the Judges"] },

  // Divided Kingdom & Prophets
  { year: -870, label: "Elijah the Prophet", type: "event", category: "biblical-events", subcategory: "divided-kingdom", detail: "The prophet Elijah confronts King Ahab and Queen Jezebel over their promotion of Baal worship in the northern kingdom, culminating in the dramatic contest on Mount Carmel where fire from heaven consumes his sacrifice. He announces a three-year drought as divine judgment, performs miracles for a widow in Zarephath, and flees from Jezebel to Mount Horeb where God speaks in a still small voice. Elijah is later taken to heaven in a chariot of fire without dying, making him one of only two biblical figures to bypass death. Jewish tradition expects his return before the Messiah, a belief referenced in the New Testament.", wiki: "Elijah", significance: "Elijah becomes the archetypal prophet in Jewish tradition, and his expected return shapes messianic expectations that Jesus and John the Baptist engage with directly.", quote: "How long will you waver between two opinions? If the Lord is God, follow him; but if Baal is God, follow him. — 1 Kings 18:21", sources: ["1 Kings 17-19", "2 Kings 1-2"], relatedEvents: ["Kingdom Divides", "Elisha Begins Ministry", "John the Baptist"] },
  { year: -852, label: "Elisha Begins Ministry", type: "event", category: "biblical-events", subcategory: "divided-kingdom", detail: "Elisha succeeds Elijah as prophet in Israel, receiving a double portion of his spirit after witnessing Elijah's fiery ascent. His ministry spans the reigns of several northern kings and includes numerous miracles: purifying water, multiplying oil, raising a dead child, healing Naaman the Syrian, and feeding a hundred men with twenty loaves. He also plays a political role, anointing Jehu as king to overthrow the house of Ahab. Elisha's miracles often parallel and exceed Elijah's, fulfilling the promise of the double portion.", wiki: "Elisha", significance: "Elisha's extensive miracle ministry demonstrates prophetic authority operating independently of royal power and provides narrative templates later echoed in Jesus' own miracles.", quote: "Let me inherit a double portion of your spirit. — 2 Kings 2:9", sources: ["2 Kings 2-13"], relatedEvents: ["Elijah the Prophet", "Kingdom Divides", "Jeroboam II in Israel"] },
  { year: -781, label: "Jeroboam II in Israel", type: "event", category: "biblical-events", subcategory: "divided-kingdom", detail: "Jeroboam II presides over the northern kingdom's greatest period of prosperity and territorial expansion, restoring Israel's borders from Lebo Hamath to the Dead Sea. The economic boom creates a wealthy ruling class but widens the gap between rich and poor dramatically. The prophets Amos and Hosea arise during this period to condemn the social injustice, religious complacency, and empty ritual that accompany the prosperity. Ironically, this golden age precedes the northern kingdom's destruction by Assyria within a generation.", wiki: "Jeroboam_II", significance: "This period produces some of the earliest written prophetic literature (Amos, Hosea) and demonstrates the prophetic theme that material prosperity without justice invites divine judgment.", sources: ["2 Kings 14:23-29", "Book of Amos"], relatedEvents: ["Kingdom Divides", "Fall of North Kingdom", "Early Prophets"] },
  { year: -775, label: "Jonah Preaches in Nineveh", type: "event", category: "biblical-events", subcategory: "divided-kingdom", detail: "The prophet Jonah is sent to preach repentance to Nineveh, the capital of Assyria and Israel's most feared enemy. After fleeing by sea and being swallowed by a great fish for three days, he reluctantly delivers his message and the entire city repents. Jonah's anger at God's mercy toward a pagan enemy reveals the book's central theme: God's compassion extends beyond Israel to all nations. The narrative is unusual among prophetic books for focusing on the prophet's own failings rather than his oracles.", wiki: "Jonah", significance: "The book of Jonah challenges Israelite exclusivism by showing God's concern for gentile nations, a theme that anticipates the universal scope of the New Testament gospel.", quote: "Should I not have concern for the great city of Nineveh, in which there are more than a hundred and twenty thousand people? — Jonah 4:11", sources: ["Book of Jonah", "2 Kings 14:25"], relatedEvents: ["Jeroboam II in Israel", "Fall of North Kingdom", "Gentiles Become Christians"] },
  { year: -750, label: "Uzziah and Jotham in Judah", type: "event", category: "biblical-events", subcategory: "divided-kingdom", detail: "Kings Uzziah and Jotham preside over a period of relative strength and prosperity in Judah, with Uzziah's fifty-two-year reign among the longest in Judean history. Uzziah strengthens Jerusalem's fortifications, develops agriculture, and maintains a powerful army. However, his reign ends tragically when he usurps priestly duties by burning incense in the Temple and is struck with leprosy. The year of Uzziah's death is also when Isaiah receives his prophetic calling in a dramatic temple vision.", wiki: "Uzziah", significance: "This prosperous era in Judah parallels Jeroboam II's reign in Israel and provides the political stability during which Isaiah begins his influential prophetic ministry.", quote: "In the year that King Uzziah died, I saw the Lord, high and exalted, seated on a throne. — Isaiah 6:1", sources: ["2 Chronicles 26", "Isaiah 6"], relatedEvents: ["Kingdom Divides", "Jeroboam II in Israel", "Early Prophets"] },
  { year: -701, label: "Sennacherib Invades Judah", type: "event", category: "biblical-events", subcategory: "divided-kingdom", detail: "The Assyrian king Sennacherib besieges Jerusalem during Hezekiah's reign after conquering forty-six fortified cities of Judah, including the major fortress of Lachish. Hezekiah pays heavy tribute but Sennacherib demands total surrender; the prophet Isaiah assures the king that God will defend the city. According to the biblical account, an angel of the Lord strikes down 185,000 Assyrian soldiers in a single night, forcing Sennacherib's retreat. Both biblical and Assyrian records (the Taylor Prism) attest to the campaign, though they diverge on the outcome.", wiki: "Sennacherib%27s_campaign_in_Judah", significance: "Jerusalem's miraculous deliverance becomes a defining moment in Judean theology, reinforcing belief in Zion's inviolability that later prophets like Jeremiah must challenge.", quote: "I will defend this city and save it, for my sake and for the sake of David my servant. — 2 Kings 19:34", sources: ["2 Kings 18-19", "Sennacherib's Taylor Prism"], relatedEvents: ["Fall of North Kingdom", "Josiah's Reform", "Babylonian Exile"] },

  // Exile & Babylonian Period
  { year: -604, label: "Daniel Taken Captive", type: "event", category: "biblical-events", subcategory: "exile-babylon", detail: "The young Daniel is deported to Babylon in Nebuchadnezzar's first campaign against Judah, along with other promising youths of royal and noble families. He and his companions Hananiah, Mishael, and Azariah are trained in Babylonian language and literature while maintaining their Jewish dietary laws and faith. Daniel quickly distinguishes himself through his ability to interpret dreams, gaining access to the highest levels of Babylonian and later Persian government. His career spans the entire exile period, from Nebuchadnezzar through the Persian conquest.", wiki: "Daniel_(biblical_figure)", significance: "Daniel becomes the model for faithful Jewish life under foreign rule, demonstrating that devotion to God can coexist with service in a pagan empire — a crucial template for diaspora Judaism.", quote: "But Daniel resolved not to defile himself with the royal food and wine. — Daniel 1:8", sources: ["Daniel 1", "2 Kings 24:1"], relatedEvents: ["Babylonian Exile", "Nebuchadnezzar's Dream", "Shadrach, Meshach, and Abednego"] },
  { year: -601, label: "Nebuchadnezzar's Dream", type: "event", category: "biblical-events", subcategory: "exile-babylon", detail: "King Nebuchadnezzar has a troubling dream of a great statue made of gold, silver, bronze, iron, and clay, which Daniel interprets as a succession of world empires destined to be replaced by God's eternal kingdom. When the court magicians fail to even describe the dream, Daniel receives it through divine revelation and gains the king's favor. The four-empire scheme (typically identified as Babylon, Persia, Greece, and Rome) becomes foundational to biblical apocalypticism. The vision establishes the genre of historical apocalypse that characterizes the rest of the book of Daniel.", wiki: "Statue_of_Nebuchadnezzar%27s_dream", significance: "This vision introduces the concept of successive world empires culminating in God's kingdom, a framework that profoundly shapes Jewish and Christian eschatology through Revelation.", quote: "In the time of those kings, the God of heaven will set up a kingdom that will never be destroyed. — Daniel 2:44", sources: ["Daniel 2"], relatedEvents: ["Daniel Taken Captive", "Daniel's Apocalyptic Visions", "Daniel Written"] },
  { year: -597, label: "Great Deportation", type: "event", category: "biblical-events", subcategory: "exile-babylon", detail: "Nebuchadnezzar deports King Jehoiachin and thousands of Judah's elite to Babylon after a brief siege, replacing Jehoiachin with his uncle Zedekiah as a puppet ruler. This second major deportation includes the prophet Ezekiel, skilled craftsmen, warriors, and much of Jerusalem's leadership — an estimated ten thousand people. The Babylonian Chronicles independently confirm the siege and capture of Jerusalem in March 597 BCE. The deportees settle along the Chebar canal in Babylon, where Ezekiel will begin his prophetic ministry among them.", wiki: "Siege_of_Jerusalem_(597_BC)", significance: "This deportation removes the intellectual and religious leadership of Judah, forcing Judaism to begin adapting to life without sovereignty — a transformation that produces the synagogue and intensified scriptural study.", quote: "He carried all Jerusalem into exile: all the officers and fighting men, and all the skilled workers and artisans — a total of ten thousand. — 2 Kings 24:14", sources: ["2 Kings 24:10-17", "Babylonian Chronicles"], relatedEvents: ["Babylonian Exile", "Daniel Taken Captive", "Ezekiel's Temple Vision"] },
  { year: -588, label: "Jerusalem Under Siege", type: "event", category: "biblical-events", subcategory: "exile-babylon", detail: "Nebuchadnezzar begins his final siege of Jerusalem after King Zedekiah rebels against Babylonian rule, breaking his oath of allegiance. The siege lasts roughly two years, causing severe famine as conditions inside the city become desperate — the book of Lamentations preserves harrowing descriptions. When the walls are finally breached in 586 BCE, Zedekiah flees but is captured, forced to watch his sons executed, then blinded and taken to Babylon. The Temple of Solomon is burned, the city walls demolished, and the remaining population deported or scattered.", wiki: "Siege_of_Jerusalem_(587_BC)", significance: "The destruction of Jerusalem and the Temple is the most traumatic event in the Hebrew Bible, reshaping Israelite religion from a temple-centered cult into the text-centered faith that becomes Judaism.", quote: "By the rivers of Babylon we sat and wept when we remembered Zion. — Psalm 137:1", sources: ["2 Kings 25", "Lamentations"], relatedEvents: ["Babylonian Exile", "Great Deportation", "Jeremiah & Ezekiel"] },
  { year: -584, label: "Shadrach, Meshach, and Abednego", type: "event", category: "biblical-events", subcategory: "exile-babylon", detail: "Three Jewish exiles — Shadrach, Meshach, and Abednego (their Babylonian names for Hananiah, Mishael, and Azariah) — refuse to worship Nebuchadnezzar's ninety-foot golden image on the plain of Dura. Denounced by jealous officials, they are thrown into a fiery furnace heated seven times hotter than usual. They emerge completely unharmed, and the king sees a fourth figure in the flames 'like a son of the gods.' The episode prompts Nebuchadnezzar to issue a decree protecting the Jewish God, demonstrating that faithfulness under persecution can transform even imperial policy.", wiki: "Shadrach,_Meshach,_and_Abednego", significance: "This story becomes a paradigm for Jewish and Christian martyrdom, teaching that God may deliver the faithful through persecution rather than from it, and that loyalty to God supersedes loyalty to the state.", quote: "If we are thrown into the blazing furnace, the God we serve is able to deliver us from it. But even if he does not, we will not serve your gods. — Daniel 3:17-18", sources: ["Daniel 3"], relatedEvents: ["Daniel Taken Captive", "Daniel in the Lion's Den", "Nebuchadnezzar's Insanity"] },
  { year: -572, label: "Ezekiel's Temple Vision", type: "event", category: "biblical-events", subcategory: "exile-babylon", detail: "The prophet Ezekiel receives an elaborate vision of an ideal future temple in chapters 40-48, complete with precise measurements, liturgical arrangements, and a river of life flowing from the sanctuary. The vision comes twenty-five years into the exile, when hope for restoration is fading among the deportees. Ezekiel's temple is not merely a rebuilt version of Solomon's but a transformed, perfected sacred space where God's glory returns permanently. The vision provides a theological blueprint for Jewish eschatological expectations and influences later apocalyptic literature including Revelation.", wiki: "Ezekiel%27s_Temple", significance: "This vision sustains exilic hope by projecting a future where God's presence returns to a purified Israel, directly influencing both the Second Temple rebuilding and New Testament imagery of the heavenly Jerusalem.", quote: "Son of man, this is the place of my throne and the place for the soles of my feet. This is where I will live among the Israelites forever. — Ezekiel 43:7", sources: ["Ezekiel 40-48"], relatedEvents: ["Babylonian Exile", "New Temple Completed", "Jeremiah & Ezekiel"] },
  { year: -562, label: "Nebuchadnezzar's Insanity", type: "event", category: "biblical-events", subcategory: "exile-babylon", detail: "According to Daniel 4, Nebuchadnezzar is struck with a period of madness after ignoring Daniel's warning to repent of his pride, living like an animal and eating grass for seven years. The episode is framed as a direct consequence of the king's boast: 'Is not this the great Babylon I have built?' His reason eventually returns and he praises the Most High God, acknowledging divine sovereignty over all earthly kingdoms. Scholars note that the account may reflect traditions about the later king Nabonidus, who withdrew to the Arabian desert for years — the Dead Sea Scrolls' 'Prayer of Nabonidus' tells a strikingly similar story.", wiki: "Nebuchadnezzar_II", significance: "The narrative reinforces Daniel's central theme that God humbles the proud and that even the most powerful rulers are subject to divine authority.", quote: "Those who walk in pride he is able to humble. — Daniel 4:37", sources: ["Daniel 4", "Prayer of Nabonidus (4Q242)"], relatedEvents: ["Nebuchadnezzar's Dream", "Daniel Taken Captive", "Writing on the Wall"] },
  { year: -552, label: "Daniel's Apocalyptic Visions", type: "event", category: "biblical-events", subcategory: "exile-babylon", detail: "Daniel receives a series of symbolic visions: four beasts rising from the sea (chapter 7), a ram and goat representing Persia and Greece (chapter 8), and the prophecy of seventy weeks (chapter 9). The four beasts vision introduces the 'Son of Man' figure who receives an everlasting dominion from the Ancient of Days, imagery that Jesus later applies to himself. The seventy-weeks prophecy becomes one of the most debated chronological texts in Scripture, with calculations pointing variously to the Maccabean period or the time of Christ. These chapters become foundational for both Jewish and Christian apocalyptic literature, directly influencing the book of Revelation.", wiki: "Book_of_Daniel", significance: "Daniel's visions establish the apocalyptic worldview that God controls the course of empires and will ultimately establish an eternal kingdom, providing the conceptual framework for New Testament eschatology.", quote: "One like a son of man, coming with the clouds of heaven... He was given authority, glory and sovereign power. — Daniel 7:13-14", sources: ["Daniel 7-9", "Daniel Written"], relatedEvents: ["Nebuchadnezzar's Dream", "Daniel's Last Vision", "Revelation"] },
  { year: -542, label: "Writing on the Wall", type: "event", category: "biblical-events", subcategory: "exile-babylon", detail: "During King Belshazzar's lavish feast for a thousand nobles, he desecrates the sacred vessels taken from the Jerusalem Temple by using them for drinking. A mysterious hand appears and writes on the palace wall; the terrified king summons Daniel to interpret the words. Daniel reads 'Mene, Mene, Tekel, Upharsin' — meaning God has numbered, weighed, and divided Belshazzar's kingdom. That very night Babylon falls to the Persians under Cyrus, and Belshazzar is killed, fulfilling the prophecy within hours of its delivery.", wiki: "Belshazzar%27s_feast", significance: "The fall of Babylon to Persia is the pivotal geopolitical event that makes the Jewish return from exile possible, and Daniel's role validates prophetic authority at the moment of imperial transition.", quote: "You have been weighed on the scales and found wanting. — Daniel 5:27", sources: ["Daniel 5"], relatedEvents: ["Nebuchadnezzar's Insanity", "Daniel in the Lion's Den", "Return from Exile"] },
  { year: -541, label: "Daniel in the Lion's Den", type: "event", category: "biblical-events", subcategory: "exile-babylon", detail: "After the Persian conquest of Babylon, Daniel serves as one of three administrators over the empire, provoking jealousy among rival officials. They manipulate King Darius into signing a decree forbidding prayer to anyone but the king for thirty days, knowing Daniel will not comply. Daniel continues his practice of praying three times daily toward Jerusalem and is thrown into a den of lions, but God sends an angel to shut the lions' mouths. Darius, overjoyed at Daniel's survival, issues a decree honoring the God of Daniel throughout the empire.", wiki: "Daniel_in_the_lions%27_den", significance: "Like the fiery furnace episode, this story reinforces that faithfulness to God takes precedence over human law and that divine deliverance validates the life of faith under foreign rule.", quote: "My God sent his angel, and he shut the mouths of the lions. They have not hurt me, because I was found innocent in his sight. — Daniel 6:22", sources: ["Daniel 6"], relatedEvents: ["Shadrach, Meshach, and Abednego", "Writing on the Wall", "Daniel's Last Vision"] },

  // Return & Restoration
  { year: -536, label: "Daniel's Last Vision", type: "event", category: "biblical-events", subcategory: "return-restoration", detail: "Daniel receives his final revelation in the third year of Cyrus, a detailed prophecy spanning Persian and Greek periods through the reign of Antiochus Epiphanes and beyond. An angelic messenger describes conflicts between the kings of the north and south, corresponding closely to Ptolemaic-Seleucid wars. The vision in Daniel 10-12 concludes with the first clear Old Testament reference to individual resurrection: 'Multitudes who sleep in the dust of the earth will awake.' This final vision represents the most detailed prophetic-historical survey in the Hebrew Bible.", wiki: "Book_of_Daniel", significance: "Daniel 12 introduces the doctrine of bodily resurrection into Jewish theology, a belief that becomes central to Pharisaic Judaism and foundational to Christian faith.", quote: "Multitudes who sleep in the dust of the earth will awake: some to everlasting life, others to shame and everlasting contempt. — Daniel 12:2", sources: ["Daniel 10-12"], relatedEvents: ["Daniel's Apocalyptic Visions", "Return from Exile", "Antiochus Epiphanes"] },
  { year: -520, label: "Haggai and Zechariah", type: "event", category: "biblical-events", subcategory: "return-restoration", detail: "The prophets Haggai and Zechariah urge the returned exiles to resume rebuilding the Temple, which had stalled for sixteen years due to opposition from local populations and the exiles' own discouragement. Haggai shames the people for living in paneled houses while the Temple lies in ruins, while Zechariah offers messianic visions of a coming Branch who will rebuild the Temple. Their combined preaching under the Persian governor Zerubbabel and the high priest Joshua motivates the community to complete the Second Temple. Zechariah's later oracles introduce imagery of a humble king riding on a donkey, later applied to Jesus.", wiki: "Haggai", significance: "These prophets catalyze the reconstruction of the Temple and bridge pre-exilic prophetic traditions with the messianic expectations that characterize the intertestamental and New Testament periods.", quote: "Not by might nor by power, but by my Spirit, says the Lord Almighty. — Zechariah 4:6", sources: ["Book of Haggai", "Zechariah 1-8"], relatedEvents: ["Return from Exile", "New Temple Completed", "Babylonian Exile"] },
  { year: -516, label: "New Temple Completed", type: "event", category: "biblical-events", subcategory: "return-restoration", detail: "The Second Temple is completed and dedicated in Jerusalem, seventy years after the destruction of Solomon's Temple, fulfilling Jeremiah's prophecy. Though modest compared to the first — older returnees weep at the comparison — it becomes the center of Jewish worship for the next six centuries. The dedication is celebrated with sacrifices and the reinstitution of the Passover. This temple will later be magnificently expanded by Herod the Great, becoming one of the ancient world's most impressive structures.", wiki: "Second_Temple", significance: "The Second Temple restores the institutional center of Jewish worship and identity, providing the sacred space where Judaism develops into its classical form and where Jesus will later teach.", quote: "The glory of this present house will be greater than the glory of the former house, says the Lord Almighty. — Haggai 2:9", sources: ["Ezra 6", "Book of Haggai"], relatedEvents: ["Haggai and Zechariah", "Return from Exile", "Temple Destroyed"] },
  { year: -480, label: "Esther and Mordecai", type: "event", category: "biblical-events", subcategory: "return-restoration", detail: "Queen Esther and her cousin Mordecai thwart Haman's plot to annihilate the Jewish people throughout the Persian Empire under King Ahasuerus (likely Xerxes I). Esther risks death by approaching the king uninvited, revealing her Jewish identity and Haman's genocidal scheme. The tables are dramatically turned: Haman is hanged on the very gallows he built for Mordecai, and the Jews are authorized to defend themselves. The deliverance is commemorated annually in the festival of Purim, one of the most celebratory holidays in the Jewish calendar.", wiki: "Book_of_Esther", significance: "Esther is the only biblical book that never mentions God by name, yet its narrative of providential deliverance affirms divine care for the Jewish people in diaspora and establishes the feast of Purim.", quote: "And who knows but that you have come to your royal position for such a time as this? — Esther 4:14", sources: ["Book of Esther"], relatedEvents: ["Return from Exile", "Babylonian Exile", "Ezra Returns"] },
  { year: -465, label: "Malachi's Prophecy", type: "event", category: "biblical-events", subcategory: "return-restoration", detail: "The prophet Malachi delivers the last prophetic book of the Old Testament, rebuking the people and priests for corrupt worship, withholding tithes, and interfaith marriages. Writing in a distinctive question-and-answer format, he challenges a community grown cynical about God's justice and faithfulness. Malachi promises the coming of a messenger to prepare the way before the Lord, along with the return of Elijah before the great and dreadful day of the Lord. His book closes with an appeal to remember the Law of Moses, creating a literary bridge to the New Testament.", wiki: "Book_of_Malachi", significance: "As the final prophetic voice before the intertestamental silence, Malachi's messianic promises frame Jewish expectations for centuries and are directly applied to John the Baptist in the Gospels.", quote: "I will send my messenger, who will prepare the way before me. Then suddenly the Lord you are seeking will come to his temple. — Malachi 3:1", sources: ["Book of Malachi"], relatedEvents: ["New Temple Completed", "John the Baptist", "Elijah the Prophet"] },
  { year: -458, label: "Ezra Returns", type: "event", category: "biblical-events", subcategory: "return-restoration", detail: "Ezra the scribe leads a second wave of exiles back to Jerusalem with authorization and generous funding from the Persian king Artaxerxes I. He is described as a scholar 'skilled in the Law of Moses,' and his primary mission is to teach and enforce Torah observance in the restored community. Ezra is horrified to discover widespread intermarriage with surrounding peoples and leads a dramatic public repentance. Jewish tradition credits him with reconstituting the Torah text, establishing the Great Assembly, and essentially founding the scribal tradition that later becomes rabbinic Judaism.", wiki: "Ezra_(scribe)", significance: "Ezra's reforms elevate the written Torah to the center of Jewish identity, marking the decisive shift from a temple-and-prophet religion to the text-centered faith that defines Judaism.", quote: "For Ezra had devoted himself to the study and observance of the Law of the Lord, and to teaching its decrees and laws in Israel. — Ezra 7:10", sources: ["Ezra 7-10", "Nehemiah 8"], relatedEvents: ["Return from Exile", "Nehemiah Rebuilds Wall", "Priestly Source & Torah"] },
  { year: -444, label: "Nehemiah Rebuilds Wall", type: "event", category: "biblical-events", subcategory: "return-restoration", detail: "Nehemiah, cupbearer to King Artaxerxes, is moved to tears by reports of Jerusalem's ruined walls and receives royal permission to return and rebuild them. He organizes the community into work teams, each responsible for a section of wall, while armed guards protect against raids from Sanballat, Tobiah, and other hostile neighbors. The project is completed in just fifty-two days, an achievement the narrative attributes to divine help and communal determination. Nehemiah also addresses economic exploitation of the poor by wealthy Jews, canceling debts and restoring land.", wiki: "Nehemiah", significance: "The rebuilt walls restore Jerusalem's physical security and civic identity, creating the protected space within which Ezra's Torah-centered reforms can take root and flourish.", quote: "The God of heaven will give us success. We his servants will start rebuilding. — Nehemiah 2:20", sources: ["Nehemiah 1-6"], relatedEvents: ["Ezra Returns", "Dedication of the Wall", "Return from Exile"] },
  { year: -425, label: "Dedication of the Wall", type: "event", category: "biblical-events", subcategory: "return-restoration", detail: "The rebuilt walls of Jerusalem are formally dedicated with two great processions marching in opposite directions along the top of the walls, meeting at the Temple with music, singing, and sacrifices. Ezra reads the Torah publicly to the assembled people, who weep at hearing the Law and then celebrate with feasting. Nehemiah institutes social and religious reforms including Sabbath observance, tithing, and prohibition of intermarriage to strengthen the restored community. This moment marks the consolidation of post-exilic Judaism as a community defined by Torah, Temple, and territorial integrity.", wiki: "Book_of_Nehemiah", significance: "The dedication ceremony and public Torah reading represent the birth of synagogue-style worship and establish the pattern of communal Scripture reading that both Judaism and Christianity continue.", quote: "The joy of the Lord is your strength. — Nehemiah 8:10", sources: ["Nehemiah 8-12"], relatedEvents: ["Nehemiah Rebuilds Wall", "Ezra Returns", "New Temple Completed"] },

  // Intertestamental Period
  { year: -424, label: "Artaxerxes Dies", type: "event", category: "biblical-events", subcategory: "intertestamental", detail: "The death of Persian King Artaxerxes I marks the end of the biblical period covered by Ezra-Nehemiah, closing the last historically datable narrative in the Hebrew Bible. Jewish tradition often considers this the moment when prophetic inspiration ceases, inaugurating a 'silent period' between the testaments. The Persian Empire continues to provide relative stability and religious freedom for the Jewish community in Judea. This transition point helps explain why Jewish canon formation later draws a line roughly here between inspired and non-inspired writings.", wiki: "Artaxerxes_I_of_Persia", significance: "The end of Artaxerxes' reign marks the traditional boundary of the Jewish prophetic era and effectively defines the chronological limit of the Hebrew Bible's narrative.", sources: ["Nehemiah 13", "Josephus, Against Apion 1.8"], relatedEvents: ["Nehemiah Rebuilds Wall", "Malachi's Prophecy", "Alexander Conquers"] },
  { year: -323, label: "Rise of the Ptolemies", type: "event", category: "biblical-events", subcategory: "intertestamental", detail: "After Alexander the Great's death in 323 BCE, his general Ptolemy seizes Egypt and establishes a dynasty that rules Judea for over a century. Under Ptolemaic rule, the Jewish community in Alexandria grows into one of the largest diaspora populations, eventually producing the Septuagint — the Greek translation of the Hebrew Bible. Ptolemaic governance is generally tolerant of Jewish religious practice, allowing the Temple cult to continue and Jewish communities to self-govern. The cultural encounter with Hellenism during this period profoundly reshapes Jewish intellectual life, producing philosophical works like the Wisdom of Solomon.", wiki: "Ptolemaic_Kingdom", significance: "Ptolemaic Alexandria becomes the birthplace of the Septuagint, which becomes the Bible of early Christianity and preserves the deuterocanonical books that remain in Catholic and Orthodox canons.", sources: ["1 Maccabees 1", "Josephus, Antiquities 12"], relatedEvents: ["Alexander Conquers", "Septuagint Begins", "Antiochus Epiphanes"] },
  { year: -201, label: "Rome Defeats Hannibal", type: "event", category: "biblical-events", subcategory: "intertestamental", detail: "Rome's victory over Carthage at the Battle of Zama in the Second Punic War establishes Roman dominance in the western Mediterranean and signals the rise of a new superpower. Within decades, Rome begins intervening in the affairs of the Hellenistic east, defeating the Seleucid king Antiochus III at Magnesia in 190 BCE. Rome's expanding power will eventually bring it into direct control over the Jewish homeland, replacing the Hellenistic kingdoms. The shift from Greek to Roman hegemony creates the political framework within which Jesus is born and Christianity emerges.", wiki: "Battle_of_Zama", significance: "Rome's rise as a Mediterranean superpower sets in motion the political conditions under which Judea becomes a Roman province, directly shaping the world of the New Testament.", sources: ["1 Maccabees 8", "Polybius, Histories"], relatedEvents: ["Alexander Conquers", "Pompey Invades Palestine", "Augustus Caesar and Pax Romana"] },
  { year: -190, label: "Antiochus Epiphanes", type: "event", category: "biblical-events", subcategory: "intertestamental", detail: "Antiochus IV Epiphanes rises to power in the Seleucid Empire and aggressively promotes Hellenization throughout his domains, including Judea. He outlaws Jewish religious practices including circumcision, Sabbath observance, and Torah study under penalty of death. In 167 BCE he desecrates the Jerusalem Temple by erecting an altar to Zeus and sacrificing pigs, an act referred to in Daniel as the 'abomination of desolation.' This provocation triggers the Maccabean Revolt, led by the priestly Mattathias family, which ultimately restores Jewish independence and Temple worship.", wiki: "Antiochus_IV_Epiphanes", significance: "The crisis under Antiochus produces the Maccabean Revolt, the festival of Hanukkah, and likely the final composition of the book of Daniel, which frames the persecution within God's sovereign plan.", quote: "Forces from him shall appear and profane the temple and fortress, and shall take away the regular burnt offering. And they shall set up the abomination that makes desolate. — Daniel 11:31", sources: ["1 Maccabees 1-2", "2 Maccabees 5-7"], relatedEvents: ["Maccabean Revolt", "Daniel's Last Vision", "Rise of the Ptolemies"] },
  { year: -135, label: "Jewish Rule Under Hyrcanus", type: "event", category: "biblical-events", subcategory: "intertestamental", detail: "John Hyrcanus I establishes an independent Jewish state under the Hasmonean dynasty after the death of his father Simon Maccabeus. He expands Judea's borders significantly, conquering Samaria and destroying the Samaritan temple on Mount Gerizim, and forcibly converting the Idumeans (Edomites) to Judaism. His reign represents the height of Hasmonean power but also generates internal controversy, as the Pharisees challenge the legitimacy of combining royal and priestly authority. The Pharisee-Sadducee split that defines Jewish politics in Jesus' day traces its origins to conflicts during Hyrcanus' rule.", wiki: "John_Hyrcanus", significance: "Hyrcanus' reign creates the political and religious party divisions — Pharisees, Sadducees, and Essenes — that define Jewish society in the New Testament period.", sources: ["Josephus, Antiquities 13", "1 Maccabees 16"], relatedEvents: ["Maccabean Revolt", "Pompey Invades Palestine", "Antiochus Epiphanes"] },
  { year: -63, label: "Pompey Invades Palestine", type: "event", category: "biblical-events", subcategory: "intertestamental", detail: "The Roman general Pompey, exploiting a Hasmonean civil war between brothers Hyrcanus II and Aristobulus II, captures Jerusalem after a three-month siege. He scandalously enters the Holy of Holies but — to Jewish surprise — takes nothing from it, though the violation is deeply felt. Judea becomes a Roman client state, stripped of its coastal cities and Transjordanian territories. This event ends eighty years of Jewish political independence and sets the stage for Roman rule throughout the New Testament era.", wiki: "Siege_of_Jerusalem_(63_BC)", significance: "Pompey's conquest establishes Roman authority over Judea, creating the imperial framework within which Jesus lives, Paul travels, and the early church develops.", sources: ["Josephus, Antiquities 14", "Josephus, Jewish War 1"], relatedEvents: ["Jewish Rule Under Hyrcanus", "Caesar Appoints Antipater", "Rome Defeats Hannibal"] },
  { year: -47, label: "Caesar Appoints Antipater", type: "event", category: "biblical-events", subcategory: "intertestamental", detail: "Julius Caesar appoints Antipater the Idumean as procurator of Judea, rewarding his military support during Caesar's Alexandrian campaign. Antipater, though an Idumean (Edomite) convert to Judaism, proves a shrewd political operator who positions his sons in key roles: Phasael as governor of Jerusalem and Herod as governor of Galilee. This appointment shifts power from the Hasmonean priestly dynasty to the Herodian family, a transition resented by many Jews who view the Idumeans as outsiders. Antipater's assassination in 43 BCE leaves his ambitious son Herod to pursue the kingship with Roman backing.", wiki: "Antipater_the_Idumaean", significance: "Antipater's appointment inaugurates the Herodian dynasty that rules Judea during the birth of Jesus and the early decades of Christianity, fundamentally shaping New Testament politics.", sources: ["Josephus, Antiquities 14", "Josephus, Jewish War 1"], relatedEvents: ["Pompey Invades Palestine", "Herod King of Judea", "Birth of Jesus"] },
  { year: -37, label: "Herod King of Judea", type: "event", category: "biblical-events", subcategory: "intertestamental", detail: "Herod the Great captures Jerusalem with Roman military backing after a three-year campaign and begins his reign as king of Judea, confirmed by the Roman Senate. He undertakes massive building projects including the spectacular expansion of the Second Temple, the fortress of Masada, the port city of Caesarea Maritima, and numerous palaces. Herod's paranoia leads to the execution of his own wife Mariamne and several sons, prompting Augustus to quip that it was safer to be Herod's pig than his son. Matthew's account of the massacre of Bethlehem's infants fits this pattern of ruthless violence.", wiki: "Herod_the_Great", significance: "Herod's Temple expansion creates the magnificent sacred space where Jesus teaches and the early church worships, while his political brutality provides the backdrop for the nativity narrative.", quote: "When Herod realized that he had been outwitted by the Magi, he was furious, and he gave orders to kill all the boys in Bethlehem. — Matthew 2:16", sources: ["Josephus, Antiquities 15-17", "Matthew 2"], relatedEvents: ["Caesar Appoints Antipater", "Birth of Jesus", "Temple Destroyed"] },
  { year: -27, label: "Augustus Caesar and Pax Romana", type: "event", category: "biblical-events", subcategory: "intertestamental", detail: "Octavian defeats Mark Antony at Actium in 31 BCE and becomes Emperor Augustus in 27 BCE, inaugurating the Pax Romana — a two-hundred-year period of relative peace across the Mediterranean world. The empire's road network, common Greek language, legal protections for travel, and suppression of piracy create unprecedented conditions for the movement of people and ideas. Early Christians later interpret this providential timing as God preparing the world for the gospel's rapid spread. Luke explicitly ties the birth of Jesus to Augustus' census decree, placing salvation history within the frame of imperial history.", wiki: "Pax_Romana", significance: "The Pax Romana provides the infrastructure — roads, common language, legal frameworks, and relative peace — that enables Christianity to spread across the Mediterranean within a single generation.", quote: "In those days Caesar Augustus issued a decree that a census should be taken of the entire Roman world. — Luke 2:1", sources: ["Luke 2:1", "Josephus, Antiquities 17"], relatedEvents: ["Herod King of Judea", "Birth of Jesus", "Rome Defeats Hannibal"] },

  // Life of Christ
  { year: -4, endYear: -2, label: "Wise Men Worship Jesus", type: "event", category: "biblical-events", subcategory: "life-of-christ", detail: "Magi from the east — likely Zoroastrian astrologer-priests from Persia or Babylon — follow a star to Bethlehem and present gifts of gold, frankincense, and myrrh to the child Jesus. Their arrival at Herod's court in Jerusalem asking about the newborn 'king of the Jews' triggers alarm throughout the city. Herod consults the chief priests who identify Bethlehem as the prophesied birthplace, then secretly instructs the Magi to report back. When they depart by another route, Herod orders the massacre of all male infants in Bethlehem under age two.", wiki: "Biblical_Magi", significance: "The visit of Gentile wise men to worship a Jewish king foreshadows the universal scope of Jesus' mission and signals from the outset that the gospel will reach beyond Israel to all nations.", quote: "Where is the one who has been born king of the Jews? We saw his star when it rose and have come to worship him. — Matthew 2:2", sources: ["Matthew 2:1-12"], relatedEvents: ["Birth of Jesus", "Flight into Egypt", "Herod King of Judea"] },
  { year: -4, endYear: -2, label: "Flight into Egypt", type: "event", category: "biblical-events", subcategory: "life-of-christ", detail: "Warned by an angel in a dream, Joseph flees with Mary and the infant Jesus to Egypt to escape Herod's massacre of Bethlehem's infants. Egypt had a substantial Jewish diaspora community, particularly in Alexandria, providing a natural refuge. Matthew presents the family's sojourn and return as fulfilling Hosea's prophecy, 'Out of Egypt I called my son,' drawing a typological parallel between Jesus and Israel's own Exodus experience. The flight demonstrates Matthew's recurring theme that Jesus recapitulates Israel's story in his own person.", wiki: "Flight_into_Egypt", significance: "The Egypt sojourn establishes Jesus as a new Moses figure who relives Israel's foundational experience, reinforcing Matthew's portrayal of Jesus as the fulfillment of Israel's story.", quote: "Out of Egypt I called my son. — Matthew 2:15 (citing Hosea 11:1)", sources: ["Matthew 2:13-15"], relatedEvents: ["Wise Men Worship Jesus", "Birth of Jesus", "Return to Nazareth"] },
  { year: -3, endYear: -1, label: "Return to Nazareth", type: "event", category: "biblical-events", subcategory: "life-of-christ", detail: "After Herod's death in 4 BCE, an angel instructs Joseph to return to Israel, but fear of Herod's son Archelaus, who rules Judea, leads the family to settle in Nazareth of Galilee instead of Bethlehem. Nazareth is a small, insignificant village of perhaps 400 people, prompting Nathanael's later skepticism: 'Can anything good come from Nazareth?' Jesus grows up here working as a tekton (carpenter or craftsman) until the start of his public ministry around age thirty. Luke records one childhood episode — the twelve-year-old Jesus astounding Temple teachers — but otherwise the roughly thirty 'hidden years' remain silent in the Gospels.", wiki: "Nazareth", significance: "Jesus' upbringing in obscure Nazareth underscores the theme of divine hiddenness and the unexpected nature of the Messiah, confounding expectations of a royal or priestly origin.", quote: "He went and lived in a town called Nazareth. So was fulfilled what was said through the prophets, that he would be called a Nazarene. — Matthew 2:23", sources: ["Matthew 2:19-23", "Luke 2:39-52"], relatedEvents: ["Flight into Egypt", "Birth of Jesus", "John the Baptist"] },
  { year: 27, label: "John the Baptist", type: "event", category: "biblical-events", subcategory: "life-of-christ", detail: "John the Baptist begins preaching repentance and baptizing in the Jordan River wilderness, drawing large crowds from Jerusalem and all Judea. His ascetic lifestyle and fiery preaching recall the prophet Elijah, whose return Malachi had promised. John identifies Jesus as the coming Messiah — 'the Lamb of God who takes away the sin of the world' — and baptizes him, at which point the Spirit descends and a divine voice affirms Jesus' identity. All four Gospels present John as the prophetic forerunner whose ministry inaugurates the messianic age.", wiki: "John_the_Baptist", significance: "John bridges the Old and New Testaments as the last prophet of the old covenant and the herald of the new, fulfilling Malachi's promise of Elijah's return before the Messiah.", quote: "I baptize you with water for repentance. But after me comes one who is more powerful than I. He will baptize you with the Holy Spirit and fire. — Matthew 3:11", sources: ["Matthew 3", "Mark 1:1-11"], relatedEvents: ["Malachi's Prophecy", "Ministry of Jesus", "Elijah the Prophet"] },
  { year: 28, label: "Opposition to Jesus", type: "event", category: "biblical-events", subcategory: "life-of-christ", detail: "Religious leaders — Pharisees, Sadducees, and scribes — increasingly oppose Jesus' teaching and healing ministry, accusing him of blasphemy, violating the Sabbath, and casting out demons by the power of Beelzebul. Jesus' association with tax collectors and sinners, his claim to forgive sins, and his challenge to oral tradition intensify the conflict. The opposition crystallizes after Jesus heals on the Sabbath and the Pharisees begin plotting his destruction. This escalating hostility drives the narrative arc toward Jerusalem and the cross throughout the Synoptic Gospels.", wiki: "Ministry_of_Jesus", significance: "The growing opposition reveals the fundamental conflict between Jesus' kingdom vision and the religious establishment's authority, providing the dramatic tension that drives the Gospel narratives toward the Passion.", sources: ["Mark 2-3", "Matthew 12"], relatedEvents: ["Ministry of Jesus", "John the Baptist", "Crucifixion & Resurrection"] },
  { year: 29, label: "Feeding of the 5000", type: "event", category: "biblical-events", subcategory: "life-of-christ", detail: "Jesus feeds a crowd of five thousand men (plus women and children) with five loaves and two fish in a remote area near the Sea of Galilee. It is the only miracle recorded in all four Gospels, underscoring its centrality to the early church's memory of Jesus. The crowd, recognizing echoes of Moses' provision of manna in the wilderness, attempts to make Jesus king by force, prompting him to withdraw. In John's account, Jesus follows the miracle with the 'Bread of Life' discourse, identifying himself as the true bread from heaven.", wiki: "Feeding_the_multitude", significance: "This miracle crystallizes the tension between popular messianic expectations of a political deliverer and Jesus' understanding of his mission as spiritual and sacrificial.", quote: "I am the bread of life. Whoever comes to me will never go hungry, and whoever believes in me will never be thirsty. — John 6:35", sources: ["Mark 6:30-44", "John 6"], relatedEvents: ["Ministry of Jesus", "Opposition to Jesus", "Crucifixion & Resurrection"] },
  { year: 30, label: "Ascension of Jesus", type: "event", category: "biblical-events", subcategory: "life-of-christ", detail: "Forty days after his resurrection, Jesus ascends to heaven from the Mount of Olives in the presence of his disciples, commissioning them to be his witnesses 'to the ends of the earth.' Acts 1 records the event as the transition from Jesus' earthly ministry to the era of the Church, with two angels assuring the disciples that Jesus will return in the same manner. The ascension establishes Jesus' heavenly authority and inaugurates the period of the Spirit, which begins ten days later at Pentecost. Theologically, it affirms Jesus' exaltation to God's right hand, a claim central to early Christian preaching.", wiki: "Ascension_of_Jesus", significance: "The ascension marks the pivot between the Gospels and Acts, ending Jesus' physical presence and inaugurating the Spirit-empowered mission of the church that continues to the present.", quote: "You will receive power when the Holy Spirit comes on you; and you will be my witnesses in Jerusalem, and in all Judea and Samaria, and to the ends of the earth. — Acts 1:8", sources: ["Acts 1:1-11", "Luke 24:50-53"], relatedEvents: ["Crucifixion & Resurrection", "Holy Spirit at Pentecost", "Ministry of Jesus"] },

  // Early Church & Acts
  { year: 30, label: "Holy Spirit at Pentecost", type: "event", category: "biblical-events", subcategory: "early-church", detail: "The Holy Spirit descends on the apostles in Jerusalem on the Jewish festival of Pentecost (Shavuot), fifty days after the resurrection, enabling them to speak in other languages understood by the diverse crowd of diaspora Jews gathered for the feast. Peter delivers a sermon interpreting the event through the prophet Joel and declaring Jesus as Lord and Messiah, leading to about three thousand conversions. The new believers form a community sharing possessions, breaking bread together, and devoting themselves to the apostles' teaching. This event is often called the 'birthday of the Church' and marks the beginning of the Christian movement as a distinct community.", wiki: "Pentecost", significance: "Pentecost fulfills Jesus' promise of the Spirit and launches the church's mission, reversing Babel's scattering of languages with a unifying message understood by all nations.", quote: "In the last days, God says, I will pour out my Spirit on all people. Your sons and daughters will prophesy. — Acts 2:17 (citing Joel 2:28)", sources: ["Acts 2"], relatedEvents: ["Ascension of Jesus", "Crucifixion & Resurrection", "Stephen Martyred"] },
  { year: 32, endYear: 37, label: "Stephen Martyred", type: "event", category: "biblical-events", subcategory: "early-church", detail: "Stephen, one of seven deacons appointed to serve the growing community, becomes the first Christian martyr after delivering a lengthy speech before the Sanhedrin recounting Israel's history of rejecting God's messengers. His accusers charge him with speaking against the Temple and the Law, and his vision of Jesus standing at God's right hand provokes the council to stone him. As he dies, Stephen echoes Jesus' words of forgiveness toward his killers. His death triggers a wider persecution led by Saul of Tarsus (later Paul) that scatters believers throughout Judea and Samaria, inadvertently spreading the gospel beyond Jerusalem.", wiki: "Saint_Stephen", significance: "Stephen's martyrdom and the resulting persecution scatter the church beyond Jerusalem, catalyzing the geographic expansion that fulfills Jesus' commission to be witnesses 'to the ends of the earth.'", quote: "Lord, do not hold this sin against them. — Acts 7:60", sources: ["Acts 6-8"], relatedEvents: ["Holy Spirit at Pentecost", "Conversion of Paul", "Gentiles Become Christians"] },
  { year: 34, endYear: 38, label: "Gentiles Become Christians", type: "event", category: "biblical-events", subcategory: "early-church", detail: "Peter receives a vision of unclean animals and a divine command to 'kill and eat,' overturning Jewish dietary distinctions and preparing him to enter the home of Cornelius, a Roman centurion in Caesarea. When the Holy Spirit falls on Cornelius' household while Peter preaches, the Jewish believers are astonished that Gentiles receive the same gift without circumcision or Torah observance. Peter authorizes their baptism, establishing the precedent that Gentiles can enter the Church directly. This breakthrough provokes controversy in the Jerusalem church and eventually leads to the Council of Jerusalem to settle the matter.", wiki: "Cornelius_the_Centurion", significance: "The Cornelius episode is the theological hinge of Acts, establishing that the gospel transcends ethnic and ritual boundaries and opening the door for Paul's Gentile mission.", quote: "I now realize how true it is that God does not show favoritism but accepts from every nation the one who fears him and does what is right. — Acts 10:34-35", sources: ["Acts 10-11"], relatedEvents: ["Council of Jerusalem", "Paul's First Journey", "Jonah Preaches in Nineveh"] },
  { year: 45, endYear: 47, label: "Paul's First Journey", type: "event", category: "biblical-events", subcategory: "early-church", detail: "Commissioned by the church at Antioch, Paul and Barnabas travel through Cyprus and southern Asia Minor, establishing churches in Pisidian Antioch, Iconium, Lystra, and Derbe. The journey establishes the pattern of preaching first in local synagogues, then turning to Gentiles when Jewish audiences reject the message. At Lystra, Paul is stoned and left for dead but recovers and continues the mission. On the return trip, they appoint elders in each new church, creating the organizational structure for ongoing community life.", wiki: "Paul_the_Apostle%27s_first_missionary_journey", significance: "This journey establishes the missionary pattern that transforms Christianity from a Jewish sect in Palestine into a movement spreading across the Roman Empire.", quote: "We now turn to the Gentiles. For this is what the Lord has commanded us: I have made you a light for the Gentiles. — Acts 13:46-47", sources: ["Acts 13-14"], relatedEvents: ["Conversion of Paul", "Council of Jerusalem", "Gentiles Become Christians"] },
  { year: 50, endYear: 51, label: "Paul's Second Journey", type: "event", category: "biblical-events", subcategory: "early-church", detail: "After the Council of Jerusalem resolves the Gentile circumcision debate, Paul travels through Asia Minor and crosses into Europe for the first time, guided by a vision of a Macedonian man calling for help. He establishes churches in Philippi, Thessalonica, Athens (where he preaches at the Areopagus), and Corinth (where he stays eighteen months). He writes 1 Thessalonians during this journey, likely the earliest surviving New Testament document. The journey brings the gospel into the heart of Greek culture and Roman administration.", wiki: "Paul_the_Apostle%27s_second_missionary_journey", significance: "Paul's crossing into Europe is one of the most consequential moments in Western history, bringing Christianity to the continent where it will become the dominant religious and cultural force.", quote: "During the night Paul had a vision of a man of Macedonia standing and begging him, 'Come over to Macedonia and help us.' — Acts 16:9", sources: ["Acts 15:36-18:22", "1 Thessalonians"], relatedEvents: ["Council of Jerusalem", "Paul's First Journey", "Paul's Early Letters"] },
  { year: 53, label: "Paul's Third Journey", type: "event", category: "biblical-events", subcategory: "early-church", detail: "Paul spends nearly three years in Ephesus, the commercial capital of the province of Asia, where his preaching provokes a riot by silversmiths who make shrines of Artemis. He revisits churches in Macedonia and Greece, collecting a financial offering from Gentile congregations for the poor in Jerusalem as a concrete symbol of unity. During this journey he writes several of his most theologically significant epistles: 1 Corinthians, 2 Corinthians, and Romans. The letter to the Romans in particular becomes the most influential document in Christian theology.", wiki: "Paul_the_Apostle%27s_third_missionary_journey", significance: "This journey produces Paul's greatest theological writings — especially Romans — which shape Christian doctrine on justification, grace, and the relationship between Jews and Gentiles for the next two millennia.", sources: ["Acts 18:23-21:16", "Romans"], relatedEvents: ["Paul's Second Journey", "Paul's Major Letters", "Paul Arrested"] },
  { year: 58, label: "Paul Arrested", type: "event", category: "biblical-events", subcategory: "early-church", detail: "Paul is arrested in the Jerusalem Temple after being falsely accused of bringing the Gentile Trophimus of Ephesus past the barrier separating the Court of the Gentiles from the inner courts — a capital offense. A mob drags him from the Temple and attempts to kill him before Roman soldiers intervene. Paul addresses the crowd in Hebrew, recounting his conversion, and is taken into the Antonia Fortress. He is later transferred to Roman custody in Caesarea under armed escort when a conspiracy of forty men vow to assassinate him, beginning years of imprisonment.", wiki: "Paul_the_Apostle", significance: "Paul's arrest in Jerusalem begins the chain of events that brings him to Rome, fulfilling the narrative arc of Acts from Jerusalem to the capital of the empire.", quote: "Take courage! As you have testified about me in Jerusalem, so you must also testify in Rome. — Acts 23:11", sources: ["Acts 21:27-23:35"], relatedEvents: ["Paul's Third Journey", "Paul Before Felix and Festus", "Paul's Voyage to Rome"] },
  { year: 58, endYear: 60, label: "Paul Before Felix and Festus", type: "event", category: "biblical-events", subcategory: "early-church", detail: "Paul spends two years imprisoned in Caesarea, appearing before the Roman governors Felix and Festus and the Herodian King Agrippa II in a series of formal hearings. Felix, hoping for a bribe, keeps Paul in custody; his successor Festus reopens the case. Paul delivers a powerful defense before Agrippa, who famously responds, 'Do you think that in such a short time you can persuade me to be a Christian?' Paul exercises his right as a Roman citizen to appeal to Caesar, which sends his case to Rome and ironically provides the mechanism for the gospel to reach the imperial capital.", wiki: "Antonius_Felix", significance: "Paul's legal proceedings before Roman officials demonstrate Christianity's growing visibility within imperial administration and set the precedent for the faith's complex relationship with state power.", quote: "I appeal to Caesar! — Acts 25:11", sources: ["Acts 24-26"], relatedEvents: ["Paul Arrested", "Paul's Voyage to Rome", "Nero's Persecution"] },
  { year: 60, label: "Paul's Voyage to Rome", type: "event", category: "biblical-events", subcategory: "early-church", detail: "Paul sails for Rome as a prisoner under the centurion Julius, surviving a catastrophic fourteen-day storm and shipwreck on Malta described in vivid detail in Acts 27-28. All 276 passengers survive, fulfilling Paul's assurance from an angelic vision. On Malta, Paul is bitten by a viper but suffers no harm, leading the islanders to consider him a god; he also heals the father of the island's chief official. The voyage narrative is one of the most detailed accounts of ancient seafaring in existence and demonstrates Luke's skill as a historian.", wiki: "Paul%27s_shipwreck_on_Malta", significance: "The dramatic voyage illustrates the theme of divine providence protecting Paul until he can testify in Rome, completing the geographic arc of Acts from Jerusalem to the empire's capital.", sources: ["Acts 27-28"], relatedEvents: ["Paul Before Felix and Festus", "Paul Under House Arrest", "Paul Arrested"] },
  { year: 61, endYear: 63, label: "Paul Under House Arrest", type: "event", category: "biblical-events", subcategory: "early-church", detail: "Paul lives under house arrest in Rome for two years, chained to a rotating guard of Praetorian soldiers while freely receiving visitors and preaching the gospel. Acts ends with this arrangement, leaving Paul's legal outcome unstated — a deliberate literary choice that emphasizes the unstoppable advance of the gospel rather than Paul's personal fate. Tradition holds that he wrote the 'Prison Epistles' during this period: Philippians, Philemon, Colossians, and Ephesians, which contain some of his most mature theology. His imprisonment actually advances the gospel, as the entire Praetorian Guard learns of Christ through their contact with him.", wiki: "Paul_the_Apostle", significance: "The Prison Epistles composed during this period contain Paul's most developed Christology and ecclesiology, shaping Christian understanding of Christ's cosmic supremacy and the nature of the church.", quote: "Now I want you to know, brothers and sisters, that what has happened to me has actually served to advance the gospel. — Philippians 1:12", sources: ["Acts 28:16-31", "Philippians 1"], relatedEvents: ["Paul's Voyage to Rome", "Paul's Last Travels", "Deutero-Pauline Letters"] },
  { year: 63, endYear: 64, label: "Paul's Last Travels", type: "event", category: "biblical-events", subcategory: "early-church", detail: "After his release from Roman custody, Paul may have traveled to Spain — as he expressed hope to do in Romans 15 — and revisited churches in Crete, Ephesus, and Macedonia. The Pastoral Epistles (1 Timothy, 2 Timothy, Titus) reflect this period of continued missionary activity, focusing on church organization, sound doctrine, and leadership succession. Paul leaves Titus in Crete and Timothy in Ephesus to address false teaching and establish qualified elders. Whether Paul actually reached Spain remains debated, though Clement of Rome (writing around 96 CE) claims he went 'to the extreme limit of the west.'", wiki: "Paul_the_Apostle", significance: "This period marks Paul's transition from church planting to church consolidation, establishing the pastoral leadership structures that sustain Christianity after the apostolic generation passes.", sources: ["1 Timothy", "Titus", "1 Clement 5"], relatedEvents: ["Paul Under House Arrest", "Paul's Final Imprisonment", "Pastoral Epistles"] },
  { year: 64, endYear: 67, label: "Paul's Final Imprisonment", type: "event", category: "biblical-events", subcategory: "early-church", detail: "Paul is arrested again, likely during or shortly after Nero's persecution following the Great Fire of Rome in 64 CE, and imprisoned in Rome under far harsher conditions than his first detention. According to tradition, he writes 2 Timothy from this final imprisonment — a deeply personal letter that reads as his spiritual last will and testament. He acknowledges that 'the time of my departure has come' and urges Timothy to persevere in faithful ministry. Church tradition holds that Paul was beheaded (a privilege of Roman citizenship) on the Ostian Way, likely around 67 CE.", wiki: "Paul_the_Apostle", significance: "Paul's execution marks the end of the apostolic era's most prolific missionary and theologian, whose letters would become roughly half the New Testament and the theological foundation of Christianity.", quote: "I have fought the good fight, I have finished the race, I have kept the faith. Now there is in store for me the crown of righteousness. — 2 Timothy 4:7-8", sources: ["2 Timothy", "1 Clement 5"], relatedEvents: ["Nero's Persecution", "Paul's Last Travels", "Pastoral Epistles"] },

  /* ═══════════════ INDIVIDUAL BIBLE BOOKS ═══════════════ */

  // ── Torah / Pentateuch ──
  {
    year: -1445, endYear: -1405, label: "Genesis", type: "writing-ot", category: "books", subcategory: "torah", wiki: "Book_of_Genesis",
    storyStart: -4000, storyEnd: -1805,
    attributed: "Moses",
    scholarly: "Composite — J, E, and P sources woven together by redactors over centuries",
    dispute: "High — virtually no critical scholar defends Mosaic authorship of the final text; the Documentary Hypothesis remains the dominant framework, though its details are debated",
    detail: "The first book of the Bible, recounting creation, the flood, the patriarchal narratives of Abraham, Isaac, Jacob, and Joseph, and the origins of Israel as a people. Traditionally attributed to Moses, though scholars identify at least three major literary sources (J, E, and P) spanning from the 10th to the 5th century BCE. The two creation accounts (Genesis 1 and 2) are a classic example of source divergence — the first is orderly and priestly, the second anthropomorphic and earthy. The book's final form likely dates to the post-exilic period when priestly editors wove the sources together into a continuous narrative.",
    significance: "Provides the theological foundation for the entire biblical canon — creation, fall, covenant, and election — concepts that both Judaism and Christianity build upon throughout their scriptures.",
    quote: "In the beginning God created the heavens and the earth. — Genesis 1:1",
    sources: ["Genesis", "Friedman, Who Wrote the Bible?", "Wenham, Genesis (Word Biblical Commentary)"],
    relatedEvents: ["Patriarchal Period", "J Source (Yahwist)", "Priestly Source & Torah"],
    canons: ["jewish","protestant","catholic","orthodox"]
  },
  {
    year: -1445, endYear: -1405, label: "Exodus", type: "writing-ot", category: "books", subcategory: "torah", wiki: "Book_of_Exodus",
    storyStart: -1805, storyEnd: -1445,
    attributed: "Moses",
    scholarly: "Composite — J, E, and P sources, with the Covenant Code (chs. 20-23) among the oldest legal material in the Bible",
    dispute: "High — the narrative combines at least two distinct traditions of the sea crossing and Sinai theophany; final redaction is post-exilic",
    detail: "Narrates Israel's liberation from Egyptian slavery, the giving of the Law at Sinai, and the construction of the Tabernacle. The Exodus event becomes the defining act of divine deliverance in Israelite theology, referenced more than any other event in the Hebrew Bible. Scholars note that the book contains doublets and contradictions pointing to multiple sources — for instance, two versions of Moses' call and two sea-crossing traditions. The Covenant Code (chs. 20-23) shows strong parallels to the Code of Hammurabi and is considered one of the oldest legal collections in the Bible. Despite the lack of direct Egyptian corroboration, the Exodus narrative's centrality to Israelite identity is beyond dispute.",
    significance: "Establishes the paradigm of divine liberation that becomes Israel's core confession — the event that prophets, psalmists, and New Testament writers invoke whenever God's saving power is at stake.",
    quote: "I am the LORD your God, who brought you out of the land of Egypt, out of the house of slavery. — Exodus 20:2",
    sources: ["Exodus", "Propp, Exodus (Anchor Bible)", "Assmann, The Invention of Religion"],
    relatedEvents: ["The Exodus", "Priestly Source & Torah", "Deuteronomist (D)"],
    canons: ["jewish","protestant","catholic","orthodox"]
  },
  {
    year: -1445, endYear: -1405, label: "Leviticus", type: "writing-ot", category: "books", subcategory: "torah", wiki: "Book_of_Leviticus",
    storyStart: -1445, storyEnd: -1445,
    attributed: "Moses",
    scholarly: "Priestly writers (P source), with the Holiness Code (H) as a distinct sub-source, both dating to the exilic or post-exilic period",
    dispute: "High — almost entirely assigned to P and H sources by critical scholars; traditional readers maintain Mosaic origin of the laws themselves",
    detail: "A detailed code of ritual law, sacrifice, purity, and holiness given at Sinai. Central to the Priestly tradition, it contains the Holiness Code (chs. 17-26) and establishes the Day of Atonement (Yom Kippur). Scholars identify two distinct priestly layers: the older P material focused on sacrifice and purity, and the later Holiness Code emphasizing ethical holiness ('You shall be holy, for I the LORD your God am holy'). Despite being perhaps the least-read book of the Bible today, Leviticus was considered the most important book in rabbinic education — children began Torah study with it. Its sacrificial theology deeply influenced the New Testament's understanding of Jesus' death as atonement.",
    significance: "Provides the sacrificial and purity framework that defines Second Temple Judaism and supplies the theological vocabulary — atonement, holiness, clean/unclean — that the New Testament reinterprets around Jesus.",
    quote: "You shall be holy, for I the LORD your God am holy. — Leviticus 19:2",
    sources: ["Leviticus", "Milgrom, Leviticus (Anchor Bible)", "Klawans, Purity, Sacrifice, and the Temple"],
    relatedEvents: ["Priestly Source & Torah", "Solomon & First Temple", "Return from Exile"],
    canons: ["jewish","protestant","catholic","orthodox"]
  },
  {
    year: -1445, endYear: -1405, label: "Numbers", type: "writing-ot", category: "books", subcategory: "torah", wiki: "Book_of_Numbers",
    storyStart: -1445, storyEnd: -1407,
    attributed: "Moses",
    scholarly: "Composite of J, E, and P sources; the census lists and itineraries are largely Priestly, while the rebellion narratives draw on older traditions",
    dispute: "High — the book's disjointed structure is a key exhibit in source criticism; no coherent single-author theory accounts for its arrangement",
    detail: "Records Israel's 40-year wilderness wandering from Sinai to the plains of Moab, including census data, rebellion narratives, and laws interspersed with travel itineraries. The book's name comes from the two census counts (chs. 1 and 26), though its Hebrew title Bemidbar ('In the Wilderness') better captures its content. Numbers is perhaps the clearest example of composite authorship in the Torah — priestly census material sits alongside vivid J/E narratives like Balaam's talking donkey and the bronze serpent. The rebellion cycle (Korah, the spies, the waters of Meribah) establishes a theology of the wilderness generation's failure that shapes later biblical thought about testing and faithfulness.",
    significance: "The wilderness wandering becomes a permanent metaphor in biblical theology — prophets, psalmists, and New Testament writers all invoke it as a warning against faithlessness and a model of divine provision.",
    quote: "The LORD bless you and keep you; the LORD make his face to shine upon you. — Numbers 6:24-25",
    sources: ["Numbers", "Levine, Numbers (Anchor Bible)", "Olson, The Death of the Old and the Birth of the New"],
    relatedEvents: ["The Exodus", "Priestly Source & Torah", "J Source (Yahwist)"],
    canons: ["jewish","protestant","catholic","orthodox"]
  },
  {
    year: -1445, endYear: -1405, label: "Deuteronomy", type: "writing-ot", category: "books", subcategory: "torah", wiki: "Book_of_Deuteronomy",
    storyStart: -1407, storyEnd: -1406,
    attributed: "Moses",
    scholarly: "Core composed by reforming priests/Levites in late 7th-century Judah (the D source); later expanded during and after the Babylonian Exile",
    dispute: "Moderate — the connection to Josiah's 621 BCE scroll is one of the most widely accepted results of biblical criticism, though debate continues over how much material is pre-Josianic",
    detail: "Moses' farewell speeches restating the Law before Israel enters Canaan. Scholars widely identify its core with the 'book of the law' discovered during Josiah's reform in 621 BCE, making it the first biblical book whose composition can be roughly dated. Deuteronomy's distinctive theology — one God, one sanctuary, covenant blessings and curses — became the interpretive lens for the entire Deuteronomistic History (Joshua through 2 Kings). Its sermonic style differs markedly from the Priestly legislation of Leviticus, and its insistence on worship centralization reflects a specific political and religious program. The book's influence on subsequent biblical thought is immense: Jesus quotes Deuteronomy more than any other book.",
    significance: "The prototype of scripture-as-authority — the first text that demonstrably drove national religious reform, establishing the pattern of a written document governing communal life.",
    quote: "Hear, O Israel: The LORD our God, the LORD is one. — Deuteronomy 6:4",
    sources: ["Deuteronomy", "Weinfeld, Deuteronomy and the Deuteronomic School", "Römer, The So-Called Deuteronomistic History"],
    relatedEvents: ["Josiah's Reform", "Deuteronomist (D)", "Babylonian Exile"],
    canons: ["jewish","protestant","catholic","orthodox"]
  },

  // ── Historical Books ──
  {
    year: -1405, endYear: -1385, label: "Joshua", type: "writing-ot", category: "books", subcategory: "historical-books", wiki: "Book_of_Joshua",
    storyStart: -1406, storyEnd: -1375,
    attributed: "Joshua (with later additions)",
    scholarly: "Deuteronomistic editors (7th-6th century BCE), incorporating older conquest traditions and tribal boundary lists",
    dispute: "High — archaeological evidence contradicts key conquest narratives (Jericho, Ai); many scholars favor a gradual settlement or peasant revolt model over military conquest",
    detail: "Recounts the Israelite conquest and settlement of Canaan under Joshua's leadership, presenting a swift, divinely ordained military campaign. Archaeological evidence for the conquest narrative is highly debated — excavations at Jericho and Ai show no destruction layers matching the biblical timeline. The book is the first volume of the Deuteronomistic History, sharing Deuteronomy's theology of obedience leading to blessing. The tribal allotment lists (chs. 13-21) likely preserve genuinely old administrative records. The book's theology of holy war and total destruction (herem) has been one of the most ethically challenging aspects of the Old Testament for later readers.",
    significance: "Opens the Deuteronomistic History and establishes the land-promise fulfillment that anchors Israelite theology — without Joshua, the Abrahamic covenant narrative remains incomplete.",
    quote: "Be strong and courageous, for the LORD your God is with you wherever you go. — Joshua 1:9",
    sources: ["Joshua", "Noth, The Deuteronomistic History", "Finkelstein & Silberman, The Bible Unearthed"],
    relatedEvents: ["The Exodus", "Period of the Judges", "Deuteronomist (D)"],
    canons: ["jewish","protestant","catholic","orthodox"]
  },
  {
    year: -1043, label: "Judges", type: "writing-ot", category: "books", subcategory: "historical-books", wiki: "Book_of_Judges",
    storyStart: -1375, storyEnd: -1075,
    attributed: "Samuel (per Talmudic tradition)",
    scholarly: "Deuteronomistic editors compiled older hero traditions; the Song of Deborah (ch. 5) is among the oldest poetry in the Hebrew Bible",
    dispute: "Moderate — the antiquity of individual traditions is widely accepted, but the theological framework is clearly Deuteronomistic and later",
    detail: "Depicts a cyclical pattern of apostasy, oppression, and deliverance through charismatic leaders like Deborah, Gideon, and Samson during the pre-monarchic period. The Deuteronomistic editors imposed a recurring theological framework — sin, punishment, crying out, deliverance — onto what were originally independent tribal hero stories. The Song of Deborah (ch. 5) is widely regarded as one of the oldest compositions in the entire Bible, possibly dating to the 12th century BCE. The book's final chapters (17-21) depict escalating moral chaos, building the case that Israel needs a king. This pro-monarchic conclusion stands in tension with the anti-monarchic strand in 1 Samuel, suggesting complex editorial layers.",
    significance: "Provides the theological template of covenant infidelity leading to national disaster — the interpretive pattern that the Deuteronomistic History applies to the fall of both kingdoms.",
    quote: "In those days there was no king in Israel; all the people did what was right in their own eyes. — Judges 21:25",
    sources: ["Judges", "Noth, The Deuteronomistic History", "Boling, Judges (Anchor Bible)"],
    relatedEvents: ["Period of the Judges", "King David's Reign", "Deuteronomist (D)"],
    canons: ["jewish","protestant","catholic","orthodox"]
  },
  {
    year: -1030, endYear: -1010, label: "Ruth", type: "writing-ot", category: "books", subcategory: "historical-books", wiki: "Book_of_Ruth",
    storyStart: -1140, storyEnd: -1100,
    attributed: "Samuel (per Talmudic tradition)",
    scholarly: "Anonymous; date disputed — some place it in the monarchic period, others in the post-exilic era as a counterpoint to Ezra's marriage reforms",
    dispute: "Moderate — the date is genuinely uncertain; linguistic evidence and thematic purpose can support either an early or late composition",
    detail: "A short narrative about a Moabite woman's loyalty to her Israelite mother-in-law Naomi, culminating in Ruth becoming the great-grandmother of King David. The story's setting in the period of the Judges contrasts strikingly with that book's violence — here, covenant faithfulness operates through ordinary human kindness. If written in the post-exilic period, Ruth may be a deliberate protest against Ezra and Nehemiah's expulsion of foreign wives, asserting that a Moabite woman stands in the Davidic lineage. The book is read at Shavuot (Pentecost) in Jewish tradition. Matthew's Gospel includes Ruth in Jesus' genealogy, making her one of only four women named in that lineage.",
    significance: "Challenges ethnic exclusivism by placing a foreign woman at the heart of Israel's royal line — a theological statement with implications for both Jewish identity and the New Testament's universalism.",
    quote: "Where you go I will go, and where you lodge I will lodge. Your people shall be my people, and your God my God. — Ruth 1:16",
    sources: ["Ruth", "Campbell, Ruth (Anchor Bible)", "Sasson, Ruth: A New Translation"],
    relatedEvents: ["Period of the Judges", "King David's Reign", "Return from Exile"],
    canons: ["jewish","protestant","catholic","orthodox"]
  },
  {
    year: -931, endYear: -722, label: "1 Samuel", type: "writing-ot", category: "books", subcategory: "historical-books", wiki: "Books_of_Samuel",
    storyStart: -1100, storyEnd: -1010,
    attributed: "Samuel, Gad, and Nathan (per Talmudic tradition)",
    scholarly: "Deuteronomistic editors combined multiple older source documents, including pro- and anti-monarchic traditions and an independent 'History of David's Rise'",
    dispute: "Moderate — the composite nature is widely accepted; debate centers on how many sources exist and when the Deuteronomistic editing occurred",
    detail: "Covers the transition from the judges to the monarchy, narrating the stories of Samuel, Saul, and the rise of David. The book contains one of the clearest cases of dual sources in the Hebrew Bible — two contradictory accounts of how Saul became king (one enthusiastic, one hostile to monarchy) sit side by side. Scholars identify a 'History of David's Rise' embedded within the text, possibly an early court document. The Ark Narrative (chs. 4-6) may be an even older independent source. The Deuteronomistic framework interprets these traditions through a theology of obedience and kingship that reflects later concerns about the relationship between prophetic authority and royal power.",
    significance: "Narrates the birth of Israelite monarchy and establishes the tension between prophetic and royal authority that runs through the entire Deuteronomistic History.",
    quote: "To obey is better than sacrifice, and to listen than the fat of rams. — 1 Samuel 15:22",
    sources: ["1 Samuel", "McCarter, 1 Samuel (Anchor Bible)", "Noth, The Deuteronomistic History"],
    relatedEvents: ["Period of the Judges", "King David's Reign", "Deuteronomist (D)"],
    canons: ["jewish","protestant","catholic","orthodox"]
  },
  {
    year: -931, endYear: -722, label: "2 Samuel", type: "writing-ot", category: "books", subcategory: "historical-books", wiki: "Books_of_Samuel",
    storyStart: -1010, storyEnd: -970,
    attributed: "Samuel, Gad, and Nathan (per Talmudic tradition)",
    scholarly: "Deuteronomistic editors working with a 'Succession Narrative' (chs. 9-20, 1 Kings 1-2) that may be one of the earliest examples of historical prose writing",
    dispute: "Moderate — the Succession Narrative is widely regarded as early and historically grounded, though its exact date and purpose are debated",
    detail: "Continues the story of David's reign, including his triumphs, moral failures, and the internal rebellions that plagued his dynasty. The so-called 'Succession Narrative' or 'Court History' (chs. 9-20) is often considered the finest narrative prose in the Hebrew Bible and possibly the earliest example of historiographic writing in the ancient world. It portrays David with remarkable honesty — the Bathsheba affair, Amnon's rape of Tamar, Absalom's revolt — refusing to idealize the king. The Nathan oracle in chapter 7, promising David an eternal dynasty, becomes the foundational text of messianic expectation. The book was originally a single scroll with 1 Samuel; the division into two books comes from the Greek tradition.",
    significance: "The Davidic covenant promise (2 Sam 7) becomes the single most important theological text for messianic expectation in both Judaism and Christianity.",
    quote: "Your house and your kingdom shall be made sure forever before me; your throne shall be established forever. — 2 Samuel 7:16",
    sources: ["2 Samuel", "McCarter, 2 Samuel (Anchor Bible)", "Halpern, David's Secret Demons"],
    relatedEvents: ["King David's Reign", "Solomon & First Temple", "Deuteronomist (D)"],
    canons: ["jewish","protestant","catholic","orthodox"]
  },
  {
    year: -561, endYear: -538, label: "1 Kings", type: "writing-ot", category: "books", subcategory: "historical-books", wiki: "Books_of_Kings",
    storyStart: -970, storyEnd: -853,
    attributed: "Jeremiah (per Talmudic tradition)",
    scholarly: "Deuteronomistic editors compiled royal annals, temple records, and prophetic narratives; at least two editorial layers (pre-exilic and exilic) are widely recognized",
    dispute: "Low — the Deuteronomistic character of Kings is one of the most secure results of biblical criticism; debate focuses on the number of editorial stages",
    detail: "Narrates Solomon's reign, the building of the First Temple, the kingdom's division, and the prophetic ministries of Elijah through the Deuteronomistic lens. The book explicitly cites lost sources — the 'Book of the Acts of Solomon' and the royal annals of Israel and Judah — making it one of the most transparent about its editorial process. Solomon's Temple dedication prayer (ch. 8) is a masterpiece of Deuteronomistic theology, and the Elijah cycle (chs. 17-19) contains some of the most dramatic narrative in the Hebrew Bible. Every king is judged by a single criterion: faithfulness to exclusive worship of YHWH in Jerusalem. This rigid theological framework transforms court records into prophetic interpretation of history.",
    significance: "Establishes the prophetic-historical framework — evaluating political events by theological standards — that becomes the dominant mode of biblical historiography.",
    quote: "How long will you go limping between two different opinions? If the LORD is God, follow him; but if Baal, then follow him. — 1 Kings 18:21",
    sources: ["1 Kings", "Cogan, 1 Kings (Anchor Bible)", "Noth, The Deuteronomistic History"],
    relatedEvents: ["Solomon & First Temple", "Kingdom Divides", "Deuteronomist (D)"],
    canons: ["jewish","protestant","catholic","orthodox"]
  },
  {
    year: -561, endYear: -538, label: "2 Kings", type: "writing-ot", category: "books", subcategory: "historical-books", wiki: "Books_of_Kings",
    storyStart: -853, storyEnd: -586,
    attributed: "Jeremiah (per Talmudic tradition)",
    scholarly: "Deuteronomistic editors; final form composed during the Babylonian Exile (the last event recorded is the release of King Jehoiachin c. 561 BCE)",
    dispute: "Low — the exilic dating of the final edition is nearly universally accepted; the Josiah reform account (chs. 22-23) is a cornerstone of Pentateuchal criticism",
    detail: "Continues the history of the divided kingdoms through the fall of Israel (722 BCE) and Judah (586 BCE), interpreting events as consequences of covenant faithfulness or infidelity. The book contains the pivotal account of Josiah's discovery of the 'book of the law' (ch. 22), which most scholars identify as an early form of Deuteronomy. The theological verdict is devastating: the northern kingdom fell because of Jeroboam's sin, and Judah followed despite Josiah's reforms because Manasseh's evil was too great to forgive. The book ends not with destruction but with a small note of hope — Jehoiachin's release from Babylonian prison — leaving the Davidic line technically alive.",
    significance: "Completes the Deuteronomistic History's grand theological argument: Israel's entire political history, from conquest to exile, is explained by fidelity or infidelity to the covenant.",
    quote: "I have found the book of the law in the house of the LORD. — 2 Kings 22:8",
    sources: ["2 Kings", "Cogan & Tadmor, 2 Kings (Anchor Bible)", "Noth, The Deuteronomistic History"],
    relatedEvents: ["Fall of North Kingdom", "Josiah's Reform", "Babylonian Exile"],
    canons: ["jewish","protestant","catholic","orthodox"]
  },
  {
    year: -450, endYear: -425, label: "1 Chronicles", type: "writing-ot", category: "books", subcategory: "historical-books", wiki: "Books_of_Chronicles",
    storyStart: -1010, storyEnd: -970,
    attributed: "Ezra (per Talmudic tradition)",
    scholarly: "An anonymous post-exilic author called 'the Chronicler,' writing in the late 5th or 4th century BCE; relationship to Ezra-Nehemiah is debated",
    dispute: "Low — post-exilic date is universally accepted; the main debate is whether the Chronicler also wrote Ezra-Nehemiah",
    detail: "Retells Israel's history from Adam through David with an emphasis on Temple worship and the Levitical priesthood, written for the post-exilic community. The Chronicler systematically revises the Samuel-Kings narrative, omitting David's sins and the Bathsheba scandal while amplifying his role in organizing Temple worship and the Levitical orders. The genealogies (chs. 1-9) are the longest in the Bible and served to legitimize the returned community's identity. Chronicles represents a different historiographic tradition from the Deuteronomist — where Kings judges kings by covenant obedience, Chronicles judges them by their support for Temple worship. This shift reflects the post-exilic community's focus on the Second Temple as the center of Jewish life.",
    significance: "Shows that biblical history was actively rewritten and reinterpreted for new audiences — the Chronicler's revision of Kings is our clearest example of inner-biblical exegesis.",
    quote: "Yours, O LORD, is the greatness and the power and the glory and the victory and the majesty. — 1 Chronicles 29:11",
    sources: ["1 Chronicles", "Japhet, 1 & 2 Chronicles (Old Testament Library)", "Knoppers, 1 Chronicles (Anchor Bible)"],
    relatedEvents: ["King David's Reign", "Return from Exile", "Solomon & First Temple"],
    canons: ["jewish","protestant","catholic","orthodox"]
  },
  {
    year: -450, endYear: -425, label: "2 Chronicles", type: "writing-ot", category: "books", subcategory: "historical-books", wiki: "Books_of_Chronicles",
    storyStart: -970, storyEnd: -586,
    attributed: "Ezra (per Talmudic tradition)",
    scholarly: "The same post-exilic 'Chronicler' who composed 1 Chronicles, using Kings as a primary source while freely adapting it",
    dispute: "Low — the Chronicler's dependence on Kings is demonstrable through direct literary comparison; the theological reshaping is unmistakable",
    detail: "Covers Solomon's reign through the Babylonian exile, focusing on Judah's kings and their faithfulness to Temple worship. The Chronicler entirely omits the northern kingdom's history, treating the southern kingdom and its Temple as the sole legitimate continuation of Israel. Where Kings presents Manasseh as irredeemably wicked, Chronicles adds a repentance story (2 Chr 33) — reflecting a theology of immediate retribution where every king gets what they deserve in their own lifetime. The book ends with Cyrus's decree to rebuild the Temple, linking it directly to the Ezra-Nehemiah narrative. In the Jewish canon, Chronicles stands last — its final words ('let him go up') are the Bible's closing invitation.",
    significance: "Its position as the final book of the Jewish canon means the Hebrew Bible ends not with prophecy but with an invitation to return to Jerusalem — shaping the canonical narrative arc toward restoration.",
    quote: "If my people who are called by my name humble themselves, and pray... I will heal their land. — 2 Chronicles 7:14",
    sources: ["2 Chronicles", "Japhet, 1 & 2 Chronicles (Old Testament Library)", "Dillard, 2 Chronicles (Word Biblical Commentary)"],
    relatedEvents: ["Solomon & First Temple", "Babylonian Exile", "Return from Exile"],
    canons: ["jewish","protestant","catholic","orthodox"]
  },
  {
    year: -457, endYear: -444, label: "Ezra", type: "writing-ot", category: "books", subcategory: "historical-books", wiki: "Book_of_Ezra",
    storyStart: -538, storyEnd: -458,
    attributed: "Ezra himself (per tradition)",
    scholarly: "The Chronicler or a closely related author; the Aramaic sections (chs. 4-7) may preserve authentic Persian-era documents",
    dispute: "Moderate — the authenticity of the embedded Aramaic documents is debated; some scholars accept them as genuine, others see them as literary compositions",
    detail: "Records the return from Babylonian exile under Zerubbabel and Ezra, the rebuilding of the Temple, and Ezra's reforms centering the community on Torah observance. The book is notable for its bilingualism — significant portions are written in Aramaic rather than Hebrew, possibly reflecting authentic Persian administrative documents. Ezra's public reading of the Torah (Neh 8, originally part of the Ezra narrative) is a watershed moment in canon history: the first clear account of scripture being read to and accepted by an assembled community. His controversial expulsion of foreign wives (ch. 10) reveals the sharp ethnic boundaries the post-exilic community drew to preserve its identity.",
    significance: "Ezra's Torah reading represents the birth of Judaism as a scripture-centered religion — the moment when a written text becomes the binding constitution of a community.",
    quote: "For Ezra had set his heart to study the Law of the LORD, and to do it, and to teach his statutes and rules in Israel. — Ezra 7:10",
    sources: ["Ezra", "Blenkinsopp, Ezra-Nehemiah (Old Testament Library)", "Williamson, Ezra, Nehemiah (Word Biblical Commentary)"],
    relatedEvents: ["Return from Exile", "Babylonian Exile", "Priestly Source & Torah"],
    canons: ["jewish","protestant","catholic","orthodox"]
  },
  {
    year: -445, endYear: -425, label: "Nehemiah", type: "writing-ot", category: "books", subcategory: "historical-books", wiki: "Book_of_Nehemiah",
    storyStart: -445, storyEnd: -425,
    attributed: "Nehemiah himself (the memoir sections)",
    scholarly: "Combines authentic Nehemiah memoir material with Chronicler-style editorial framing; originally a single book with Ezra",
    dispute: "Low — the first-person memoir sections are widely regarded as among the most historically reliable narratives in the Hebrew Bible",
    detail: "A first-person memoir of Nehemiah's mission to rebuild Jerusalem's walls and reform the post-exilic community, paired with Ezra in the Jewish canon. The Nehemiah Memoir (chs. 1-7, 12-13) is one of the few genuine autobiographical texts in the Hebrew Bible and provides invaluable historical data about Persian-period Judah. The wall-rebuilding account (completed in 52 days despite opposition) is a masterpiece of political narrative. Chapter 8, describing Ezra's public Torah reading, is arguably the most important scene in canon history — it depicts the community formally accepting written scripture as authoritative. The book's social reforms (Sabbath observance, tithing, mixed-marriage prohibition) show the post-exilic community defining itself through strict Torah adherence.",
    significance: "Documents the concrete social mechanisms by which the Torah became binding communal law — the infrastructure of canon in action, not just theory.",
    quote: "So we rebuilt the wall... for the people had a mind to work. — Nehemiah 4:6",
    sources: ["Nehemiah", "Blenkinsopp, Ezra-Nehemiah (Old Testament Library)", "Williamson, Ezra, Nehemiah (Word Biblical Commentary)"],
    relatedEvents: ["Return from Exile", "Babylonian Exile", "Priestly Source & Torah"],
    canons: ["jewish","protestant","catholic","orthodox"]
  },
  {
    year: -460, endYear: -350, label: "Esther", type: "writing-ot", category: "books", subcategory: "historical-books", wiki: "Book_of_Esther",
    storyStart: -483, storyEnd: -473,
    attributed: "Mordecai (per some traditions), or unknown",
    scholarly: "Anonymous; likely composed in the Persian or early Hellenistic period (5th-4th century BCE) as a diaspora novella",
    dispute: "Moderate — the absence of any mention of God made its canonicity controversial in both Jewish and Christian traditions; Luther wished it did not exist",
    detail: "Tells of a Jewish queen in Persia who saves her people from genocide, providing the origin story for the festival of Purim. Notably, God is never explicitly mentioned in the Hebrew text — the only biblical book with this distinction. This absence troubled both rabbis and church fathers; the Greek Septuagint additions (107 verses) were composed partly to remedy it by adding prayers and divine references. The book's historical setting is debated — no Persian record mentions Vashti or Esther, though the author shows familiarity with Persian court customs. Its carnivalesque tone and reversal plot structure suggest it functions as a festival legend. Despite canonical controversy, the story's theme of hidden providence and Jewish survival in diaspora gave it enduring power.",
    significance: "Tests the boundaries of canon — a book with no mention of God, no prayer, and no covenant theology, yet preserved because of its central role in Jewish festival life and diaspora identity.",
    quote: "Who knows whether you have not come to the kingdom for such a time as this? — Esther 4:14",
    sources: ["Esther", "Berlin, Esther (JPS Bible Commentary)", "Fox, Character and Ideology in the Book of Esther"],
    relatedEvents: ["Return from Exile", "Septuagint Begins", "Additions to Esther"],
    canons: ["jewish","protestant","catholic","orthodox"]
  },

  // ── Wisdom & Poetry ──
  {
    year: -2100, endYear: -1500, label: "Job", type: "writing-ot", category: "books", subcategory: "wisdom-poetry", wiki: "Book_of_Job",
    attributed: "Moses (per Talmudic tradition) or Job himself",
    scholarly: "Anonymous; date ranges from the 7th to the 4th century BCE, with the prose frame story possibly older than the poetic dialogues",
    dispute: "Moderate — the date is genuinely uncertain; the prose prologue/epilogue and the poetic dialogues likely come from different hands and periods",
    detail: "A dramatic dialogue exploring why the righteous suffer, featuring Job's debate with three friends and God's climactic speech from the whirlwind. Possibly one of the oldest literary traditions in the Bible, though its final form dates to the exilic or post-exilic period. The prose frame story (chs. 1-2, 42) presents a patient, pious Job, while the poetic core (chs. 3-41) gives voice to a defiant sufferer who demands justice from God. The Elihu speeches (chs. 32-37) are widely regarded as a later addition. Job's closest literary parallels are Mesopotamian — the Babylonian 'Ludlul bel Nemeqi' and the 'Babylonian Theodicy' — placing it in an international wisdom tradition that transcends Israel's borders.",
    significance: "Challenges the Deuteronomistic theology of retribution that pervades much of the Hebrew Bible, insisting that suffering cannot always be explained by sin — a theological counterweight essential to the canon's integrity.",
    quote: "The LORD gave, and the LORD has taken away; blessed be the name of the LORD. — Job 1:21",
    sources: ["Job", "Habel, The Book of Job (Old Testament Library)", "Newsom, The Book of Job: A Contest of Moral Imaginations"],
    relatedEvents: ["Babylonian Exile", "Patriarchal Period", "Return from Exile"],
    canons: ["jewish","protestant","catholic","orthodox"]
  },
  {
    year: -971, endYear: -686, label: "Proverbs", type: "writing-ot", category: "books", subcategory: "wisdom-poetry", wiki: "Book_of_Proverbs",
    attributed: "Solomon (primary), with sections attributed to Agur and Lemuel",
    scholarly: "A composite anthology compiled over centuries; the 'Solomonic' collections may contain pre-exilic material, but the final editing is post-exilic",
    dispute: "Moderate — Solomonic authorship of the core collections is plausible but unprovable; the 'Words of the Wise' (22:17-24:22) show direct dependence on the Egyptian Instruction of Amenemope",
    detail: "A collection of wisdom sayings attributed primarily to Solomon, offering practical guidance on righteous living, work, speech, and relationships. The book is clearly a composite — at least seven distinct collections are identifiable, including the 'Words of the Wise' (22:17-24:22), which closely parallel the Egyptian Instruction of Amenemope, demonstrating Israel's participation in an international wisdom tradition. The personification of Wisdom as a woman (chs. 1-9), especially the majestic poem of Wisdom present at creation (8:22-31), became theologically significant for early Christianity's understanding of Christ as the pre-existent Logos. The 'Hezekiah's men' superscription (25:1) preserves a rare glimpse of scribal activity in the monarchic court.",
    significance: "Demonstrates that Israelite religion was not purely prophetic or priestly but included a robust wisdom tradition engaged with the broader ancient Near Eastern intellectual world.",
    quote: "The fear of the LORD is the beginning of knowledge; fools despise wisdom and instruction. — Proverbs 1:7",
    sources: ["Proverbs", "Fox, Proverbs (Anchor Bible)", "Clifford, Proverbs (Old Testament Library)"],
    relatedEvents: ["Solomon & First Temple", "Return from Exile", "Septuagint Begins"],
    canons: ["jewish","protestant","catholic","orthodox"]
  },
  {
    year: -940, endYear: -931, label: "Ecclesiastes", type: "writing-ot", category: "books", subcategory: "wisdom-poetry", wiki: "Ecclesiastes",
    attributed: "Solomon",
    scholarly: "Anonymous wisdom teacher (Qoheleth), likely 3rd century BCE based on late Hebrew vocabulary and Persian-era loanwords",
    dispute: "High — Solomonic authorship is a literary fiction; the language, philosophy, and social setting point decisively to the post-exilic Hellenistic period",
    detail: "A philosophical meditation on the meaning of life framed as the reflections of a king who 'has seen everything under the sun.' The Hebrew title Qoheleth (the Preacher or Assembler) is placed in Solomon's mouth, but the late Hebrew vocabulary, Aramaic influence, and possible Greek philosophical parallels date the actual composition to the 3rd century BCE. The book's radical skepticism — its insistence that human effort is hebel (vapor, futility) — sits in deliberate tension with the optimistic wisdom of Proverbs. Its inclusion in the canon was debated by rabbis at Yavneh, ultimately accepted because its opening and closing verses frame the whole as orthodox piety. Ecclesiastes remains one of the most existentially modern texts in the Bible, resonating with readers from ancient sages to Albert Camus.",
    significance: "Provides the Bible's most unflinching interrogation of meaning, suffering, and death — a counterweight to conventional piety that keeps the wisdom tradition honest.",
    quote: "Vanity of vanities, says the Preacher; all is vanity. — Ecclesiastes 1:2",
    sources: ["Ecclesiastes", "Fox, Ecclesiastes (JPS Bible Commentary)", "Bartholomew, Reading Ecclesiastes"],
    relatedEvents: ["Solomon & First Temple", "Proverbs Compiled", "Return from Exile"],
    canons: ["jewish","protestant","catholic","orthodox"]
  },
  {
    year: -971, endYear: -965, label: "Song of Solomon", type: "writing-ot", category: "books", subcategory: "wisdom-poetry", wiki: "Song_of_Songs",
    attributed: "Solomon",
    scholarly: "Anonymous poet(s), likely post-exilic (5th–3rd century BCE) based on Aramaisms and Persian loanwords; the Solomonic attribution is honorific",
    dispute: "High — the language is among the latest in the Hebrew Bible; Solomon functions as a literary patron figure rather than actual author",
    detail: "A collection of lyric love poems celebrating erotic desire between two lovers, unmatched in the Bible for its sensual imagery of bodies, gardens, and spices. The book contains no explicit mention of God, law, covenant, or Temple — a fact that made its canonicity controversial. Rabbi Akiva defended it passionately, declaring it 'the Holy of Holies' of scripture when read as an allegory of God's love for Israel. Christian interpreters followed suit, reading it as Christ's love for the Church. Modern scholarship tends to recover the literal reading: these are genuine love poems, possibly connected to ancient Near Eastern wedding liturgies. The linguistic evidence — Aramaisms, a possible Greek loanword (appiryon), and late grammatical forms — places composition centuries after Solomon.",
    significance: "Stands as the Bible's most vivid affirmation that erotic love is part of the created order — a corrective to any reading of scripture as purely ascetic or legalistic.",
    quote: "Set me as a seal upon your heart, for love is strong as death. — Song of Solomon 8:6",
    sources: ["Song of Solomon", "Pope, Song of Songs (Anchor Bible)", "Exum, Song of Songs (Old Testament Library)"],
    relatedEvents: ["Solomon & First Temple", "Proverbs Compiled", "Ecclesiastes"],
    canons: ["jewish","protestant","catholic","orthodox"]
  },

  // ── Major Prophets ──
  {
    year: -700, endYear: -681, label: "Isaiah", type: "writing-ot", category: "books", subcategory: "major-prophets", wiki: "Book_of_Isaiah",
    storyStart: -740, storyEnd: -680,
    attributed: "Isaiah son of Amoz",
    scholarly: "At least two, probably three authors — First Isaiah (chs. 1–39, 8th century BCE), Deutero-Isaiah (chs. 40–55, exilic), and Trito-Isaiah (chs. 56–66, post-exilic)",
    dispute: "High — the shift in historical setting, vocabulary, and theology between the sections is so marked that virtually all critical scholars posit multiple authors spanning over two centuries",
    detail: "The longest prophetic book in the Bible, Isaiah is a composite masterwork spanning judgment, exile, and restoration. First Isaiah (chs. 1–39) addresses 8th-century Judah under Assyrian threat, calling for trust in God rather than political alliances and introducing the mysterious Immanuel figure. Deutero-Isaiah (chs. 40–55), composed during the Babylonian exile, contains the soaring poetry of consolation ('Comfort, comfort my people') and the four Servant Songs whose suffering figure became central to Christian messianic interpretation. Trito-Isaiah (chs. 56–66) addresses the struggles of the restored post-exilic community. Despite multiple authorship, a sophisticated editorial hand has unified the book around themes of holiness, justice, and the sovereignty of Israel's God over all nations.",
    significance: "The most quoted Old Testament book in the New Testament — its Servant Songs, virgin-birth prophecy, and vision of universal peace became the primary scriptural lens through which early Christians understood Jesus.",
    quote: "Comfort, comfort my people, says your God. — Isaiah 40:1",
    sources: ["Isaiah", "Childs, Isaiah (Old Testament Library)", "Blenkinsopp, Isaiah 1–39, 40–55, 56–66 (Anchor Bible)"],
    relatedEvents: ["Fall of North Kingdom", "Babylonian Exile", "Return from Exile"],
    canons: ["jewish","protestant","catholic","orthodox"]
  },
  {
    year: -586, label: "Lamentations", type: "writing-ot", category: "books", subcategory: "major-prophets", wiki: "Book_of_Lamentations",
    storyStart: -586, storyEnd: -586,
    attributed: "Jeremiah",
    scholarly: "Anonymous poet(s) writing in Jerusalem shortly after 586 BCE; the Jeremiah attribution comes from the Septuagint and 2 Chronicles 35:25 but is not in the Hebrew text",
    dispute: "Moderate — the theology of Lamentations differs from Jeremiah's in important ways (e.g., its attitude toward the Temple), and most scholars treat the attribution as traditional rather than historical",
    detail: "Five poems of raw grief over Jerusalem's destruction by Babylon in 586 BCE, composed with extraordinary literary craft. Four of the five chapters are acrostics following the Hebrew alphabet — a formal structure that paradoxically contains the most uncontrolled anguish in scripture. The poems oscillate between collective lament, graphic descriptions of siege and starvation, confession of sin, and tentative hope that God's mercy is not exhausted. Chapter 3, the emotional center, moves from utter despair to the famous affirmation that God's mercies 'are new every morning.' The book was almost certainly written by eyewitnesses in the immediate aftermath of the catastrophe, making it one of the most historically grounded texts in the Hebrew Bible.",
    significance: "Gave Israel — and all subsequent communities in crisis — a liturgical language for grief, read annually on Tisha B'Av to commemorate the Temple's destruction.",
    quote: "The steadfast love of the LORD never ceases; his mercies never come to an end; they are new every morning. — Lamentations 3:22–23",
    sources: ["Lamentations", "Berlin, Lamentations (Old Testament Library)", "Dobbs-Allsopp, Lamentations (Interpretation)"],
    relatedEvents: ["Babylonian Exile", "Jeremiah & Ezekiel", "Psalms Finalized"],
    canons: ["jewish","protestant","catholic","orthodox"]
  },

  // ── Minor Prophets ──
  {
    year: -750, endYear: -710, label: "Hosea", type: "writing-ot", category: "books", subcategory: "minor-prophets", wiki: "Book_of_Hosea",
    storyStart: -755, storyEnd: -710,
    attributed: "Hosea son of Beeri",
    scholarly: "Core oracles from the 8th-century prophet Hosea, with later Judean editorial additions that redirected a northern text toward a southern audience",
    dispute: "Moderate — the prophetic core is widely accepted as authentic, but chapters 1–3 show signs of editorial reshaping and some Judah-references are considered secondary",
    detail: "Hosea prophesied in the northern kingdom of Israel during its final turbulent decades before the Assyrian conquest. His marriage to Gomer, a woman of promiscuity, becomes a living parable of God's relationship with faithless Israel — a theological innovation that reframes covenant loyalty in the intimate language of marriage and divorce. The book alternates between blistering accusations of idolatry and heartbreaking expressions of divine love that cannot let go. Hosea's theological vocabulary — hesed (steadfast love), knowledge of God, return — profoundly influenced Jeremiah and the Deuteronomistic tradition. After the fall of Samaria in 722 BCE, the text was apparently carried south and edited by Judean scribes who added references to their own kingdom.",
    significance: "Introduced the marriage metaphor for God's covenant that became one of the Bible's most enduring theological images, carried forward by Jeremiah, Ezekiel, and into the New Testament.",
    quote: "I desire steadfast love and not sacrifice, the knowledge of God rather than burnt offerings. — Hosea 6:6",
    sources: ["Hosea", "Andersen & Freedman, Hosea (Anchor Bible)", "Yee, Composition and Tradition in the Book of Hosea"],
    relatedEvents: ["Fall of North Kingdom", "Amos", "Jeremiah & Ezekiel"],
    canons: ["jewish","protestant","catholic","orthodox"]
  },
  {
    year: -835, endYear: -796, label: "Joel", type: "writing-ot", category: "books", subcategory: "minor-prophets", wiki: "Book_of_Joel",
    attributed: "Joel son of Pethuel",
    scholarly: "Uncertain date — proposals range from the 9th to the 4th century BCE; many scholars favor a post-exilic setting based on references to the Temple, scattered Israel, and Greek slave trade",
    dispute: "Moderate — Joel is the most difficult prophetic book to date because it contains no explicit historical references; the traditional early date and the scholarly late date both rest on inference",
    detail: "Joel transforms a devastating locust plague into a cosmic vision of the Day of the Lord. The first half describes agricultural devastation so total that even the Temple grain offerings cease, prompting an urgent call to communal repentance. The second half pivots from judgment to promise: God will restore the ravaged land, pour out his Spirit on all flesh regardless of age, gender, or social status, and ultimately judge the nations in the Valley of Jehoshaphat. The Spirit-outpouring passage (2:28–32) became the interpretive key for the early church when Peter quoted it at Pentecost to explain the phenomenon of speaking in tongues. Joel's dating remains the most contested question in Minor Prophets scholarship, with no scholarly consensus.",
    significance: "Provided the scriptural foundation for the Christian doctrine of Pentecost — the democratization of prophetic experience that Acts presents as the birth of the Church.",
    quote: "I will pour out my Spirit on all flesh; your sons and your daughters shall prophesy. — Joel 2:28",
    sources: ["Joel", "Crenshaw, Joel (Anchor Bible)", "Barton, Joel and Obadiah (Old Testament Library)"],
    relatedEvents: ["Babylonian Exile", "Return from Exile", "Amos"],
    canons: ["jewish","protestant","catholic","orthodox"]
  },
  {
    year: -750, label: "Amos", type: "writing-ot", category: "books", subcategory: "minor-prophets", wiki: "Book_of_Amos",
    storyStart: -760, storyEnd: -750,
    attributed: "Amos of Tekoa",
    scholarly: "Core oracles from the mid-8th century BCE shepherd-prophet, with later editorial expansions including the hopeful epilogue (9:11–15) likely added in the post-exilic period",
    dispute: "Low to Moderate — the basic authenticity of the oracles is widely accepted; the main debate concerns the concluding promise of restoration, which many scholars view as a later addition that softens the original message of unrelenting judgment",
    detail: "Amos, a sheep breeder and sycamore fig dresser from Tekoa in Judah, crossed into the prosperous northern kingdom around 750 BCE to deliver an unwelcome message: God was about to destroy Israel for its social injustice. His oracles against the nations (chs. 1–2) lure the audience into self-congratulation before the hammer falls on Israel itself. Amos attacks the wealthy who 'sell the righteous for silver and the needy for a pair of sandals,' and dismisses the elaborate worship at Bethel and Gilgal as hateful to God without accompanying justice. His famous declaration — 'Let justice roll down like waters' — became a touchstone for social ethics in both Jewish and Christian traditions. The book is often considered the earliest written prophetic collection, making it a milestone in the development of Israelite literature.",
    significance: "Established social justice as inseparable from authentic worship — a prophetic principle that shaped Jewish ethics, the teaching of Jesus, and modern liberation theology.",
    quote: "Let justice roll down like waters, and righteousness like an ever-flowing stream. — Amos 5:24",
    sources: ["Amos", "Paul, Amos (Hermeneia)", "Mays, Amos (Old Testament Library)"],
    relatedEvents: ["Fall of North Kingdom", "Hosea", "Micah"],
    canons: ["jewish","protestant","catholic","orthodox"]
  },
  {
    year: -850, endYear: -840, label: "Obadiah", type: "writing-ot", category: "books", subcategory: "minor-prophets", wiki: "Book_of_Obadiah",
    storyStart: -586, storyEnd: -586,
    attributed: "Obadiah (identity unknown beyond the name)",
    scholarly: "Anonymous; date disputed — some place the oracle after Edom's participation in Jerusalem's fall (586 BCE), others earlier based on parallels with Jeremiah 49",
    dispute: "Moderate — the core anti-Edom oracle may be early, but the references to Jerusalem's destruction suggest at least partial composition or revision after 586 BCE",
    detail: "At just 21 verses, Obadiah is the shortest book in the Hebrew Bible, yet it packs a concentrated theological punch. The oracle denounces Edom — Israel's 'brother' nation descended from Esau — for standing by during Jerusalem's destruction and even looting the city and handing over refugees to the Babylonians. The betrayal is cast as a violation of kinship obligation, making Edom's crime uniquely personal. Obadiah shares substantial verbal parallels with Jeremiah 49:7–22, suggesting both draw on an earlier anti-Edom tradition. The book closes with a vision of the Day of the Lord when Edom's mountain strongholds will fall and 'the kingdom shall be the LORD's.' Despite its brevity, Obadiah illustrates a recurring biblical pattern: the harshest prophetic judgment is reserved for those who should have known better.",
    significance: "Crystallizes the biblical principle that covenant betrayal by an ally is worse than attack by an enemy — a theme that resonates through the prophets and into the New Testament's treatment of Judas.",
    quote: "The day of the LORD is near upon all the nations. As you have done, it shall be done to you. — Obadiah 1:15",
    sources: ["Obadiah", "Raabe, Obadiah (Anchor Bible)", "Barton, Joel and Obadiah (Old Testament Library)"],
    relatedEvents: ["Babylonian Exile", "Jeremiah & Ezekiel", "Joel"],
    canons: ["jewish","protestant","catholic","orthodox"]
  },
  {
    year: -775, label: "Jonah", type: "writing-ot", category: "books", subcategory: "minor-prophets", wiki: "Book_of_Jonah",
    storyStart: -780, storyEnd: -760,
    attributed: "Jonah son of Amittai (cf. 2 Kings 14:25)",
    scholarly: "Anonymous author, likely post-exilic (5th–4th century BCE); the book is a didactic novella about the prophet Jonah rather than a work by him",
    dispute: "Moderate to High — the late Hebrew, literary sophistication, and universalist theology point to a much later date than the 8th-century prophet it describes; genre (history vs. parable) is the central debate",
    detail: "Jonah is unique among the prophetic books: it is not a collection of oracles but a narrative — a brilliantly crafted story about a prophet who runs from God's command to preach repentance to Nineveh, Israel's dreaded Assyrian enemy. Swallowed by a great fish and deposited on shore, Jonah reluctantly delivers the shortest sermon in the Bible ('Forty days and Nineveh will be overthrown'), only to be furious when the city actually repents and God relents. The book's theology is deliberately subversive: pagan sailors pray while the prophet sleeps, Nineveh repents while Jonah sulks, and God's closing question — about compassion for 120,000 people 'who do not know their right hand from their left' — goes unanswered. Most scholars read it as a post-exilic challenge to exclusivist tendencies in Second Temple Judaism. Jesus cites Jonah as the only 'sign' he will give his generation.",
    significance: "The Hebrew Bible's most radical statement of divine mercy for outsiders — a prophetic protest against religious nationalism that Jesus himself invoked.",
    quote: "Should I not pity Nineveh, that great city, in which there are more than 120,000 persons? — Jonah 4:11",
    sources: ["Jonah", "Sasson, Jonah (Anchor Bible)", "Limburg, Jonah (Old Testament Library)"],
    relatedEvents: ["Fall of North Kingdom", "Nahum", "Return from Exile"],
    canons: ["jewish","protestant","catholic","orthodox"]
  },
  {
    year: -735, endYear: -710, label: "Micah", type: "writing-ot", category: "books", subcategory: "minor-prophets", wiki: "Book_of_Micah",
    storyStart: -735, storyEnd: -700,
    attributed: "Micah of Moresheth",
    scholarly: "Core oracles (chs. 1–3) from the late 8th-century prophet; chapters 4–7 contain later additions, possibly exilic and post-exilic, offering hope and restoration",
    dispute: "Moderate — the judgment oracles of chapters 1–3 are broadly accepted as authentic; the salvation oracles in chapters 4–7 are debated, with many scholars attributing them to later editors",
    detail: "Micah was a rural prophet from Moresheth in the Judean lowlands, a contemporary of Isaiah but speaking from the perspective of the exploited peasantry rather than the Jerusalem court. His opening chapters contain devastating indictments of the ruling class — landlords who 'covet fields and seize them,' judges who 'tear the skin off my people' — and he shockingly predicts that Jerusalem and its Temple will be 'plowed as a field.' Later chapters pivot to hope: the famous Bethlehem prophecy (5:2), applied to Jesus in Matthew's Gospel, promises a ruler from David's ancestral village. Micah 6:8 — 'What does the LORD require of you but to do justice, and to love kindness, and to walk humbly with your God?' — is widely regarded as the most concise summary of prophetic ethics in the entire Hebrew Bible. The book's movement from judgment to hope mirrors the larger pattern of the prophetic corpus.",
    significance: "Produced what many consider the single finest summary of biblical ethics — a verse that distills the entire prophetic tradition into three requirements.",
    quote: "What does the LORD require of you but to do justice, and to love kindness, and to walk humbly with your God? — Micah 6:8",
    sources: ["Micah", "Andersen & Freedman, Micah (Anchor Bible)", "Mays, Micah (Old Testament Library)"],
    relatedEvents: ["Isaiah", "Fall of North Kingdom", "Amos"],
    canons: ["jewish","protestant","catholic","orthodox"]
  },
  {
    year: -650, label: "Nahum", type: "writing-ot", category: "books", subcategory: "minor-prophets", wiki: "Book_of_Nahum",
    storyStart: -663, storyEnd: -612,
    attributed: "Nahum the Elkoshite",
    scholarly: "Likely composed shortly before or after the fall of Nineveh in 612 BCE; the vivid imagery suggests an author close in time to the event",
    dispute: "Low — the historical setting between the fall of Thebes (663 BCE, referenced in 3:8) and the fall of Nineveh (612 BCE) is one of the most secure dates in prophetic literature",
    detail: "Nahum is a sustained poem of devastating rhetorical power celebrating the imminent destruction of Nineveh, capital of the Assyrian Empire that had terrorized the ancient Near East for centuries. The poetry is among the most vivid in the Hebrew Bible — cracking whips, galloping horses, heaps of corpses, and the city personified as a humiliated prostitute. Unlike most prophetic books, Nahum contains no call to Israel's repentance; its entire focus is on the just destruction of an oppressor. Read alongside Jonah, the two books form a remarkable diptych: Jonah shows God's mercy toward Nineveh when it repents, while Nahum shows God's judgment when that repentance does not last. Nineveh fell to a Babylonian-Median coalition in 612 BCE, an event so total that the city's location was forgotten until archaeological rediscovery in the 19th century.",
    significance: "Provides the Bible's most uncompromising affirmation that God opposes imperial violence — a message that exilic and post-exilic communities found deeply reassuring.",
    quote: "The LORD is slow to anger and great in power, and the LORD will by no means clear the guilty. — Nahum 1:3",
    sources: ["Nahum", "Roberts, Nahum, Habakkuk, and Zephaniah (Old Testament Library)", "Nogalski, The Book of the Twelve"],
    relatedEvents: ["Fall of North Kingdom", "Jonah", "Habakkuk"],
    canons: ["jewish","protestant","catholic","orthodox"]
  },
  {
    year: -615, endYear: -605, label: "Habakkuk", type: "writing-ot", category: "books", subcategory: "minor-prophets", wiki: "Book_of_Habakkuk",
    storyStart: -612, storyEnd: -605,
    attributed: "Habakkuk the prophet",
    scholarly: "Late 7th century BCE, likely during the rise of the Neo-Babylonian Empire (post-612 BCE); the Habakkuk Commentary among the Dead Sea Scrolls shows the book was actively reinterpreted at Qumran",
    dispute: "Low to Moderate — the historical setting during the Babylonian rise is widely accepted; the main debate concerns whether the psalm in chapter 3 is original to the book or a later liturgical addition",
    detail: "Habakkuk is the Bible's most philosophically daring prophetic book — a direct confrontation with God over the problem of evil. The prophet opens with a complaint: why does God tolerate injustice in Judah? God's answer is staggering — he is raising up the Babylonians as his instrument of judgment. Habakkuk's second complaint is even bolder: how can a holy God use a nation more wicked than the one being punished? The divine response culminates in the declaration 'the righteous shall live by his faith' (2:4), a verse that became foundational for Paul's theology of justification and later for Martin Luther's Reformation. The book closes with a magnificent theophanic hymn (ch. 3) in which the prophet, having received no satisfying answer, chooses to trust God anyway. The Qumran community produced a verse-by-verse commentary (1QpHab) reinterpreting the book for their own era, showing its enduring power.",
    significance: "The verse 'the righteous shall live by faith' (2:4) became the theological engine of Pauline Christianity and the Protestant Reformation — arguably the most consequential single verse in the prophetic corpus.",
    quote: "The righteous shall live by his faith. — Habakkuk 2:4",
    sources: ["Habakkuk", "Roberts, Nahum, Habakkuk, and Zephaniah (Old Testament Library)", "Andersen, Habakkuk (Anchor Bible)"],
    relatedEvents: ["Nahum", "Babylonian Exile", "Zephaniah"],
    canons: ["jewish","protestant","catholic","orthodox"]
  },
  {
    year: -635, endYear: -625, label: "Zephaniah", type: "writing-ot", category: "books", subcategory: "minor-prophets", wiki: "Book_of_Zephaniah",
    storyStart: -640, storyEnd: -625,
    attributed: "Zephaniah son of Cushi, traced back four generations to King Hezekiah",
    scholarly: "Core oracles from the late 7th century BCE during Josiah's early reign, before the 621 BCE reforms; some restoration oracles (3:9–20) may be later additions",
    dispute: "Low to Moderate — the pre-reform setting is well established by the book's condemnation of practices that Josiah later abolished; the hopeful conclusion is debated as possibly post-exilic",
    detail: "Zephaniah prophesied during the reign of King Josiah, before the discovery of the law scroll that triggered the 621 BCE reforms. His opening oracle is one of the most sweeping in the Bible: God will 'utterly sweep away everything from the face of the earth' — a deliberate reversal of creation language from Genesis. The 'Day of the Lord' dominates the book, portrayed not as Israel's triumph but as cosmic judgment beginning with Judah itself, where officials wear foreign clothing and merchants grow complacent, saying 'The LORD will not do good, nor will he do ill.' The medieval hymn Dies Irae ('Day of Wrath') draws directly from Zephaniah 1:15. After oracles against surrounding nations, the book closes with an unexpected lyric of joy: God himself will 'rejoice over you with singing' — one of the rare biblical images of a God who sings. Zephaniah's royal genealogy (unique among the prophets) may explain his access to court circles.",
    significance: "Gave Western culture its most influential vision of divine judgment day — the template behind the Dies Irae and centuries of apocalyptic imagination.",
    quote: "The LORD your God is in your midst, a mighty one who will save; he will rejoice over you with gladness. — Zephaniah 3:17",
    sources: ["Zephaniah", "Roberts, Nahum, Habakkuk, and Zephaniah (Old Testament Library)", "Berlin, Zephaniah (Anchor Bible)"],
    relatedEvents: ["Josiah's Reform", "Habakkuk", "Nahum"],
    canons: ["jewish","protestant","catholic","orthodox"]
  },
  {
    year: -520, label: "Haggai", type: "writing-ot", category: "books", subcategory: "minor-prophets", wiki: "Book_of_Haggai",
    storyStart: -520, storyEnd: -520,
    attributed: "Haggai the prophet",
    scholarly: "Oracles from 520 BCE, possibly recorded by a third-party editor who frames them in the third person; one of the most precisely datable books in the Bible",
    dispute: "Low — the four oracles are dated to specific days in the second year of Darius I (520 BCE), and the historical setting is independently confirmed by Ezra 5–6",
    detail: "Haggai delivers four precisely dated oracles between August and December of 520 BCE, all focused on a single urgent message: the returned exiles must stop building their own paneled houses and rebuild the Temple. The community had been back from Babylon for nearly two decades but had stalled on the Temple project, discouraged by economic hardship and the modest scale of the new foundation compared to Solomon's glory. Haggai links the community's agricultural failures directly to their neglect of God's house — a theological argument that the land itself withholds its bounty when worship is disordered. His words galvanize the governor Zerubbabel and the high priest Joshua to resume construction. The Second Temple was completed in 516 BCE. Haggai's brevity (just two chapters) belies his historical importance: he helped ensure that post-exilic Judaism would remain a Temple-centered religion for another six centuries.",
    significance: "Catalyzed the rebuilding of the Second Temple — the institution that would define Judaism until 70 CE and provide the physical setting for Jesus's ministry.",
    quote: "Is it a time for you yourselves to dwell in your paneled houses, while this house lies in ruins? — Haggai 1:4",
    sources: ["Haggai", "Meyers & Meyers, Haggai, Zechariah 1–8 (Anchor Bible)", "Ezra 5–6"],
    relatedEvents: ["Return from Exile", "Zechariah", "Babylonian Exile"],
    canons: ["jewish","protestant","catholic","orthodox"]
  },
  {
    year: -520, endYear: -480, label: "Zechariah", type: "writing-ot", category: "books", subcategory: "minor-prophets", wiki: "Book_of_Zechariah",
    storyStart: -520, storyEnd: -480,
    attributed: "Zechariah son of Berechiah, son of Iddo",
    scholarly: "Two distinct sections — First Zechariah (chs. 1–8, ca. 520–518 BCE) by the named prophet; Second Zechariah (chs. 9–14) by one or more anonymous authors, possibly 4th–3rd century BCE",
    dispute: "High — the division between First and Second Zechariah is one of the most firmly established results in prophetic scholarship, based on differences in style, vocabulary, historical setting, and theology",
    detail: "Zechariah is the longest and most complex of the Minor Prophets, bridging the gap between classical prophecy and apocalyptic literature. First Zechariah (chs. 1–8) records eight symbolic night visions — horsemen patrolling the earth, a flying scroll, a woman in a basket — that reassure the post-exilic community of God's continuing care and envision the restoration of Jerusalem under the dual leadership of Zerubbabel (royal) and Joshua (priestly). Second Zechariah (chs. 9–14) shifts dramatically to apocalyptic warfare, a pierced figure whom the nation mourns, and a final battle for Jerusalem. The Gospel writers drew heavily on Second Zechariah: the humble king riding a donkey (9:9), the thirty pieces of silver (11:12–13), the shepherd struck and the sheep scattered (13:7), and the pierced one (12:10) all appear in the Passion narratives. No Minor Prophet had more influence on the shape of the New Testament.",
    significance: "Supplied more messianic imagery to the New Testament Passion narratives than any other prophetic book — the donkey, the silver, the piercing, the scattered flock.",
    quote: "Rejoice greatly, O daughter of Zion! Your king is coming to you, humble and mounted on a donkey. — Zechariah 9:9",
    sources: ["Zechariah", "Meyers & Meyers, Haggai, Zechariah 1–8 (Anchor Bible)", "Petersen, Zechariah 9–14 (Old Testament Library)"],
    relatedEvents: ["Haggai", "Return from Exile", "Malachi"],
    canons: ["jewish","protestant","catholic","orthodox"]
  },
  {
    year: -440, endYear: -430, label: "Malachi", type: "writing-ot", category: "books", subcategory: "minor-prophets", wiki: "Book_of_Malachi",
    storyStart: -465, storyEnd: -430,
    attributed: "Malachi",
    scholarly: "Anonymous — 'Malachi' means 'my messenger' in Hebrew and is likely a title drawn from 3:1 rather than a personal name; dated to the mid-5th century BCE based on references to a functioning Second Temple and problems that Ezra-Nehemiah also address",
    dispute: "Moderate — the anonymity question is broadly settled (most scholars treat the name as a title), but the precise relationship to Ezra's and Nehemiah's reforms is debated",
    detail: "Malachi is structured as a series of six disputations in which God brings charges against post-exilic Judah and the people talk back. The priests offer blind and lame animals on the altar; husbands divorce their wives to marry foreign women; the people withhold tithes and complain that serving God is pointless. The tone is prosecutorial but not without tenderness — God declares 'I have loved you' in the opening verse and promises that those who fear the Lord will be his 'treasured possession' on the day of judgment. The book's final verses prophesy the return of Elijah before 'the great and dreadful Day of the Lord,' a passage that the Gospels apply to John the Baptist. Placed last in the Christian Old Testament, Malachi's closing words create the dramatic pause before the New Testament opens — four centuries of prophetic silence broken by a voice in the wilderness.",
    significance: "Serves as the literary bridge between the Testaments — its Elijah prophecy directly connects Old Testament expectation to the New Testament's opening act in the Gospels.",
    quote: "Behold, I send my messenger, and he will prepare the way before me. — Malachi 3:1",
    sources: ["Malachi", "Hill, Malachi (Anchor Bible)", "Petersen, Zechariah 9–14 and Malachi (Old Testament Library)"],
    relatedEvents: ["Return from Exile", "Zechariah", "Chronicles, Ezra, Nehemiah"],
    canons: ["jewish","protestant","catholic","orthodox"]
  },

  // ── Deuterocanonical (remaining) ──
  {
    year: -150, label: "Judith", type: "writing-deuterocanon", category: "books", subcategory: "deuterocanonical-books", wiki: "Book_of_Judith",
    storyStart: -700, storyEnd: -600,
    attributed: "Unknown",
    scholarly: "Anonymous Jewish author, likely writing in Palestine during the Hasmonean period.",
    dispute: "None on authorship — universally regarded as anonymous. Canon status is the real dispute: excluded by Protestants and Jews, included by Catholics and Orthodox.",
    detail: "A dramatic novella about a devout Jewish widow who saves her besieged city of Bethulia by infiltrating the Assyrian camp and beheading the general Holofernes. The story is set in the Neo-Assyrian period but is riddled with deliberate historical anachronisms — mixing Assyrian, Babylonian, and Persian details — signaling that the author intended theological fiction rather than history. The narrative was likely composed during the Maccabean era as a call to courageous resistance against foreign oppression. Judith's piety, beauty, and cunning make her one of the most striking heroines in biblical literature. Jerome included the book reluctantly in the Vulgate, noting it was not in the Hebrew canon.",
    significance: "Provides one of the few female-centered narratives in the biblical tradition and became a major subject in Renaissance art, symbolizing the triumph of virtue over tyranny.",
    quote: "The Lord has struck him down by the hand of a woman. — Judith 16:5",
    sources: ["Judith", "Moore, Judith (Anchor Bible)", "DeSilva, Introducing the Apocrypha"],
    relatedEvents: ["Maccabean Revolt", "Septuagint Begins", "Council of Trent"],
    canons: ["catholic","orthodox"]
  },
  {
    year: -200, endYear: -100, label: "Additions to Esther", type: "writing-deuterocanon", category: "books", subcategory: "deuterocanonical-books", wiki: "Additions_to_Esther",
    storyStart: -483, storyEnd: -473,
    attributed: "Unknown",
    scholarly: "Anonymous Greek-speaking Jewish author(s), probably from the Egyptian diaspora.",
    dispute: "None on authorship — anonymous by nature. The dispute concerns canonicity: the Hebrew Esther is the only biblical book that never mentions God, and these additions were composed precisely to remedy that theological silence.",
    detail: "Six Greek passages totaling 107 verses were inserted at various points in the Hebrew book of Esther, supplying prayers, divine references, letters, and religious content absent from the original. They transform what was essentially a secular court tale into an explicitly theological narrative in which God actively intervenes. The additions include Mordecai's dream, the texts of royal edicts, prayers by both Mordecai and Esther, an expanded audience scene, and an interpretation of Mordecai's dream. Jerome separated them into an appendix in the Vulgate, where they were numbered as chapters 10:4–16:24. The Septuagint integrates them seamlessly into the narrative flow.",
    significance: "Illustrates how Jewish communities in the diaspora actively reworked inherited texts to make them more theologically explicit for Greek-speaking audiences.",
    quote: "O God, you have knowledge of all things, and you know that it was not out of insolence that I did this. — Additions to Esther 14:15–16",
    sources: ["Additions to Esther (NRSV)", "Fox, Character and Ideology in the Book of Esther", "DeSilva, Introducing the Apocrypha"],
    relatedEvents: ["Septuagint Begins", "Council of Trent", "Jerome's Vulgate"],
    canons: ["catholic","orthodox"]
  },
  {
    year: -200, endYear: -100, label: "Additions to Daniel", type: "writing-deuterocanon", category: "books", subcategory: "deuterocanonical-books", wiki: "Additions_to_Daniel",
    storyStart: -605, storyEnd: -536,
    attributed: "Unknown",
    scholarly: "Anonymous Jewish author(s), probably composing in Greek or translating from a lost Semitic original.",
    dispute: "None on authorship — anonymous by nature. The dispute is canonical: found in the Septuagint but absent from the Hebrew/Aramaic text of Daniel, making them deuterocanonical for Catholics and Orthodox but apocryphal for Protestants and Jews.",
    detail: "Three Greek additions expand the book of Daniel: the Prayer of Azariah and Song of the Three Young Men (inserted into Daniel 3, between the Hebrew verses 23 and 24), the story of Susanna (a courtroom drama in which Daniel exonerates a falsely accused woman), and Bel and the Dragon (two satirical tales exposing idol worship as fraud). Whether these originated in Greek or were translated from Semitic originals is debated — fragments at Qumran have not settled the question. Susanna in particular became a beloved narrative, influencing Western legal and artistic traditions. Theodotion's Greek version largely displaced the original Septuagint translation for these passages.",
    significance: "Susanna provides the earliest known detective story in Western literature and shaped Christian iconography of Daniel, while the Prayer of Azariah entered liturgical use in many traditions.",
    quote: "Blessed are you, O Lord God of our ancestors, and worthy of praise; and glorious is your name forever! — Prayer of Azariah 1:3",
    sources: ["Additions to Daniel (NRSV)", "Collins, Daniel (Hermeneia)", "DeSilva, Introducing the Apocrypha"],
    relatedEvents: ["Daniel Written", "Septuagint Begins", "Council of Trent"],
    canons: ["catholic","orthodox"]
  },

  // ── Acts ──
  {
    year: 62, endYear: 64, label: "Acts of the Apostles", type: "writing-nt", category: "books", subcategory: "acts", wiki: "Acts_of_the_Apostles",
    storyStart: 30, storyEnd: 62,
    attributed: "Luke, companion of Paul",
    scholarly: "Same anonymous author as the Third Gospel ('Luke-Acts'). Traditional identification with Luke the physician (Col 4:14) is plausible but unverifiable.",
    dispute: "Low to moderate — nearly all scholars accept common authorship with the Third Gospel. The identity of that author as Luke the physician remains debated, partly because Acts' account of Paul's career diverges from Paul's own letters on several points.",
    detail: "Luke's sequel to his Gospel, tracing the early Church from Pentecost in Jerusalem through Paul's arrival in Rome, probably written in the 80s CE though traditionally dated earlier. Acts is the only narrative account of the apostolic age and thus provides the framework within which all the epistles are read. It recounts the Spirit's descent at Pentecost, Stephen's martyrdom, Paul's conversion, the Council of Jerusalem, and three missionary journeys. The 'we' passages (where the narrator shifts to first person plural) have fueled debate about whether the author was an actual travel companion of Paul. Acts downplays tensions between Paul and the Jerusalem apostles that Paul's own letters reveal more candidly.",
    significance: "Without Acts, the New Testament epistles would float in a historical vacuum — it provides the only connected narrative of how a Jewish messianic sect became a Gentile-majority movement spanning the Roman Empire.",
    quote: "You will receive power when the Holy Spirit has come upon you, and you will be my witnesses to the ends of the earth. — Acts 1:8",
    sources: ["Acts", "Pervo, Acts (Hermeneia)", "Hengel, Acts and the History of Earliest Christianity"],
    relatedEvents: ["Conversion of Paul", "Council of Jerusalem", "Matthew & Luke"],
    canons: ["protestant","catholic","orthodox"]
  },

  // ── Pauline Epistles (individual books) ──
  {
    year: 57, label: "Romans", type: "writing-nt", category: "books", subcategory: "pauline-epistles", wiki: "Epistle_to_the_Romans",
    attributed: "Paul",
    scholarly: "Authentically Pauline — virtually undisputed. One of the 'undisputed seven.'",
    dispute: "Very low — Romans is among the most securely attributed letters in the New Testament. Minor questions exist about whether chapter 16 was originally a separate letter to Ephesus.",
    detail: "Paul's most systematic theological letter, written from Corinth around 57 CE to a church he had not yet visited, probably to prepare for his planned visit and onward mission to Spain. The letter develops an extended argument about the universality of sin, justification by faith apart from works of the Law, the role of Israel in God's plan (chs. 9–11), and the ethical shape of the redeemed life. Its influence on Western theology is unmatched: Augustine's conversion was catalyzed by Romans 13, Luther's reading of Romans 1:17 ignited the Reformation, and Karl Barth's commentary on Romans launched neo-orthodox theology. Some scholars note that chapter 16, with its long greeting list, may have circulated separately.",
    significance: "The single most theologically influential letter in Christian history, shaping virtually every major doctrinal controversy from Pelagianism to the Reformation.",
    quote: "For I am not ashamed of the gospel; it is the power of God for salvation to everyone who has faith. — Romans 1:16",
    sources: ["Romans", "Jewett, Romans (Hermeneia)", "Wright, The Letter to the Romans (NIB)"],
    relatedEvents: ["Conversion of Paul", "Council of Jerusalem", "Galatians"],
    canons: ["protestant","catholic","orthodox"]
  },
  {
    year: 55, label: "1 Corinthians", type: "writing-nt", category: "books", subcategory: "pauline-epistles", wiki: "First_Epistle_to_the_Corinthians",
    attributed: "Paul",
    scholarly: "Authentically Pauline — virtually undisputed. One of the 'undisputed seven.'",
    dispute: "Very low — authorship is essentially unchallenged. Some scholars question whether 14:34–35 (women keeping silent) is a later interpolation, but the letter as a whole is securely Pauline.",
    detail: "Paul addresses a fractious congregation in the wealthy port city of Corinth, responding to reports of divisions, sexual immorality, and confusion about spiritual gifts, resurrection, and worship. The letter is our best window into the practical problems of a first-generation Gentile church. Chapter 11 preserves the earliest written account of the Lord's Supper — predating the Gospels — while chapter 15 contains the oldest recorded creed about Christ's death and resurrection, which Paul says he 'received' from those before him. The famous 'love hymn' of chapter 13 has become one of the most widely quoted passages in all of Scripture. Paul also reveals that this is not actually his first letter to Corinth (5:9), meaning an earlier letter has been lost.",
    significance: "Provides the earliest written evidence for the Eucharist and the resurrection creed, making it indispensable for reconstructing the beliefs of the very first Christians.",
    quote: "And now faith, hope, and love abide, these three; and the greatest of these is love. — 1 Corinthians 13:13",
    sources: ["1 Corinthians", "Thiselton, The First Epistle to the Corinthians (NIGTC)", "Fee, The First Epistle to the Corinthians (NICNT)"],
    relatedEvents: ["Conversion of Paul", "Romans", "2 Corinthians"],
    canons: ["protestant","catholic","orthodox"]
  },
  {
    year: 56, endYear: 57, label: "2 Corinthians", type: "writing-nt", category: "books", subcategory: "pauline-epistles", wiki: "Second_Epistle_to_the_Corinthians",
    attributed: "Paul",
    scholarly: "Authentically Pauline — virtually undisputed. One of the 'undisputed seven.' However, many scholars believe the canonical letter is a composite of two or more originally separate letters.",
    dispute: "Very low on authorship — Pauline authorship is secure. Moderate on integrity: chapters 10–13 shift so dramatically in tone (from conciliatory to blistering) that a majority of critical scholars view them as a separate 'painful letter' later spliced onto chapters 1–9.",
    detail: "Paul's most personal and emotionally intense letter, defending his apostleship against rival 'super-apostles' who have challenged his authority in Corinth. The first nine chapters express relief and reconciliation after a painful confrontation, while chapters 10–13 unleash fierce irony and self-defense — a tonal shift so sharp that many scholars believe these sections come from a different letter entirely. Paul's 'fool's speech' (11:21–12:10), in which he boasts of his weaknesses rather than his credentials, is one of the most rhetorically daring passages in antiquity. The letter also contains the famous 'thorn in the flesh' passage, whose nature Paul never specifies. It reveals more about Paul's inner life, suffering, and theology of weakness than any other letter.",
    significance: "Offers the most intimate self-portrait of any New Testament author and develops a theology of power-in-weakness that has profoundly shaped Christian spirituality.",
    quote: "My grace is sufficient for you, for power is made perfect in weakness. — 2 Corinthians 12:9",
    sources: ["2 Corinthians", "Furnish, II Corinthians (Anchor Bible)", "Thrall, Second Epistle to the Corinthians (ICC)"],
    relatedEvents: ["1 Corinthians", "Conversion of Paul", "Romans"],
    canons: ["protestant","catholic","orthodox"]
  },
  {
    year: 48, endYear: 55, label: "Galatians", type: "writing-nt", category: "books", subcategory: "pauline-epistles", wiki: "Epistle_to_the_Galatians",
    attributed: "Paul",
    scholarly: "Authentically Pauline — virtually undisputed. One of the 'undisputed seven.'",
    dispute: "Very low — Pauline authorship has never been seriously contested. The main scholarly debate concerns dating: an early date (~48 CE, before the Jerusalem Council) or a later date (~55 CE, to North Galatian churches).",
    detail: "A passionate and at times angry defense of justification by faith apart from the Jewish Law, written to churches in Galatia that were being pressured by rival teachers to require circumcision for Gentile converts. Paul opens without his usual thanksgiving — a sign of his agitation — and insists that his gospel came by direct revelation, not human teaching. The letter provides the most detailed autobiographical account of Paul's early career, including his confrontation with Peter at Antioch (2:11–14). Luther called Galatians his 'Katie von Bora' — his bride — because of its centrality to Reformation theology. The declaration that in Christ 'there is neither Jew nor Greek, slave nor free, male nor female' (3:28) has been invoked in every major Christian social-justice movement since.",
    significance: "The first articulation of the principle that became Protestantism's core — justification by faith alone — and a primary source for reconstructing Paul's biography and early church conflicts.",
    quote: "There is no longer Jew or Greek, there is no longer slave or free, there is no longer male and female; for all of you are one in Christ Jesus. — Galatians 3:28",
    sources: ["Galatians", "Martyn, Galatians (Anchor Bible)", "Dunn, The Epistle to the Galatians (BNTC)"],
    relatedEvents: ["Council of Jerusalem", "Conversion of Paul", "Romans"],
    canons: ["protestant","catholic","orthodox"]
  },
  {
    year: 61, endYear: 63, label: "Ephesians", type: "writing-nt", category: "books", subcategory: "pauline-epistles", wiki: "Epistle_to_the_Ephesians",
    attributed: "Paul",
    scholarly: "Likely deutero-Pauline — written by a disciple of Paul. About 70% of critical scholars regard it as pseudonymous.",
    dispute: "Moderate to high — the vocabulary, style, and theology differ notably from the undisputed letters. Ephesians contains 40 words not found elsewhere in Paul, uses very long sentences (one runs 202 words in Greek), and develops a 'cosmic ecclesiology' absent from the earlier letters. It also closely parallels Colossians, suggesting literary dependence.",
    detail: "A majestic letter on the cosmic unity of all things in Christ and the Church as his body and bride. Unlike most Pauline letters, Ephesians addresses no specific crisis — it reads more like a theological treatise or encyclical. The earliest manuscripts lack the words 'in Ephesus' in the opening verse, suggesting it may have been a circular letter. Its elevated, liturgical prose sets it apart from Paul's characteristically argumentative style. The 'household code' of chapters 5–6 has been both celebrated (for its vision of mutual submission) and criticized (for its patriarchal framework). Whether Paul or a brilliant disciple wrote it, Ephesians synthesizes Pauline theology into its most expansive and cosmic expression.",
    significance: "Provides the New Testament's highest ecclesiology — the vision of the Church as Christ's cosmic body — and has shaped Christian worship, marriage theology, and ecumenical dialogue for two millennia.",
    quote: "For by grace you have been saved through faith, and this is not your own doing; it is the gift of God. — Ephesians 2:8",
    sources: ["Ephesians", "Best, Ephesians (ICC)", "Lincoln, Ephesians (WBC)"],
    relatedEvents: ["Colossians", "Conversion of Paul", "Marcion's Canon"],
    canons: ["protestant","catholic","orthodox"]
  },
  {
    year: 61, endYear: 63, label: "Philippians", type: "writing-nt", category: "books", subcategory: "pauline-epistles", wiki: "Epistle_to_the_Philippians",
    attributed: "Paul",
    scholarly: "Authentically Pauline — virtually undisputed. One of the 'undisputed seven.'",
    dispute: "Very low on authorship. Moderate on integrity: some scholars argue the canonical letter combines two or three originally separate notes, based on abrupt transitions (especially at 3:2).",
    detail: "A warm letter of thanksgiving and encouragement written from prison to the church at Philippi, Paul's first European congregation and evidently his favorite. Despite his imprisonment, the letter's dominant note is joy — the word appears sixteen times. At its theological center stands the 'Christ-hymn' (2:5–11), a pre-Pauline poem about Jesus emptying himself, taking the form of a servant, and being exalted above every name. Scholars debate whether Paul composed this hymn or quoted an earlier liturgical tradition. The letter also reveals Paul's willingness to contemplate death ('to live is Christ, to die is gain') and provides a rare autobiographical sketch of his Jewish credentials (3:4–6). Philippi was a Roman colony, and Paul's language of citizenship, lordship, and savior carries subversive political overtones.",
    significance: "Contains the earliest christological hymn in the New Testament — a text that has shaped every subsequent debate about the incarnation and the divine nature of Christ.",
    quote: "Let the same mind be in you that was in Christ Jesus, who, though he was in the form of God, did not regard equality with God as something to be exploited. — Philippians 2:5–6",
    sources: ["Philippians", "Fee, Paul's Letter to the Philippians (NICNT)", "Bockmuehl, The Epistle to the Philippians (BNTC)"],
    relatedEvents: ["Conversion of Paul", "1 Thessalonians", "Philemon"],
    canons: ["protestant","catholic","orthodox"]
  },
  {
    year: 61, endYear: 63, label: "Colossians", type: "writing-nt", category: "books", subcategory: "pauline-epistles", wiki: "Epistle_to_the_Colossians",
    attributed: "Paul",
    scholarly: "Disputed — possibly deutero-Pauline. Scholarly opinion is roughly evenly divided.",
    dispute: "Moderate to high — Colossians shares unusual vocabulary, a more developed Christology, and a realized eschatology that differ from the undisputed letters. Its close literary relationship with Ephesians (which is more widely considered pseudonymous) complicates matters. Defenders note Paul could have adapted his style to address a novel situation.",
    detail: "Combats a syncretistic 'philosophy' (2:8) threatening the Colossian church — likely a blend of Jewish mysticism, ascetic practices, and angel veneration. In response, the letter presents Christ as supreme over all cosmic powers through the magnificent 'Colossian hymn' (1:15–20), which declares Christ the image of the invisible God, firstborn of all creation, in whom all things hold together. This is arguably the highest Christology in the Pauline corpus. The letter also introduces a household code (3:18–4:1) that parallels and may have inspired the one in Ephesians. Paul apparently never visited Colossae — the church was founded by Epaphras, his associate. The close connection with the letter to Philemon (same greetings, same companions) suggests a common occasion.",
    significance: "Articulates the cosmic supremacy of Christ over all spiritual powers — a Christology that became foundational for the Nicene Creed's assertion that Christ is 'through whom all things were made.'",
    quote: "He is the image of the invisible God, the firstborn of all creation; for in him all things in heaven and on earth were created. — Colossians 1:15–16",
    sources: ["Colossians", "Dunn, The Epistles to the Colossians and to Philemon (NIGTC)", "Barth & Blanke, Colossians (Anchor Bible)"],
    relatedEvents: ["Ephesians", "Philemon", "Conversion of Paul"],
    canons: ["protestant","catholic","orthodox"]
  },
  {
    year: 51, label: "1 Thessalonians", type: "writing-nt", category: "books", subcategory: "pauline-epistles", wiki: "First_Epistle_to_the_Thessalonians",
    attributed: "Paul",
    scholarly: "Authentically Pauline — virtually undisputed. One of the 'undisputed seven.'",
    dispute: "Very low — widely regarded as the earliest surviving Pauline letter and probably the oldest document in the New Testament. A small minority questions 2:14–16 (which condemns 'the Jews') as a later interpolation.",
    detail: "Likely the earliest surviving Christian document, written around 51 CE from Corinth to a young church Paul had recently founded in the Macedonian capital of Thessalonica. Paul writes to encourage believers facing local persecution and to address their anxiety about fellow Christians who have died before Christ's expected return. His reassurance — that the dead in Christ will rise first — contains the New Testament's earliest description of the parousia (4:13–18). The letter also provides a window into Paul's missionary practice: he worked with his own hands to avoid being a financial burden, and he sent Timothy back to check on the community. Notably absent are the theological complexities of later letters — no justification-by-faith argument, no Torah debate — suggesting the letter predates those controversies.",
    significance: "As the oldest surviving Christian writing, 1 Thessalonians establishes the baseline for understanding how early Christian belief developed — particularly the expectation of an imminent return of Christ.",
    quote: "For the Lord himself will descend from heaven with a cry of command, with the voice of an archangel, and with the sound of the trumpet of God. — 1 Thessalonians 4:16",
    sources: ["1 Thessalonians", "Malherbe, The Letters to the Thessalonians (Anchor Bible)", "Wanamaker, Commentary on 1 & 2 Thessalonians (NIGTC)"],
    relatedEvents: ["Conversion of Paul", "2 Thessalonians", "1 Corinthians"],
    canons: ["protestant","catholic","orthodox"]
  },
  {
    year: 51, endYear: 52, label: "2 Thessalonians", type: "writing-nt", category: "books", subcategory: "pauline-epistles", wiki: "Second_Epistle_to_the_Thessalonians",
    attributed: "Paul",
    scholarly: "Disputed — a significant minority (perhaps 40–50% of critical scholars) consider it pseudonymous.",
    dispute: "Moderate — 2 Thessalonians closely mirrors the structure and phrasing of 1 Thessalonians (unusually close for two genuine letters), yet its eschatology differs sharply: where 1 Thessalonians expects an imminent return, 2 Thessalonians insists on a series of prior events (the 'man of lawlessness'). Defenders argue Paul simply corrected a misunderstanding; skeptics see a later author deliberately imitating Paul's style.",
    detail: "Corrects an overheated expectation of Christ's imminent return, insisting that certain apocalyptic events must occur first — including the appearance of a 'man of lawlessness' who enthrones himself in God's temple, and the removal of a mysterious 'restrainer.' The identity of both figures has generated centuries of speculation (the Roman emperor, Satan, an angelic power). The letter also sharply warns against idleness: 'Anyone unwilling to work should not eat' (3:10). Its literary relationship to 1 Thessalonians is the crux of the authorship debate — the two letters share an unusually high degree of verbal parallelism, which some explain as a pseudonymous author working with 1 Thessalonians open before him. If pseudonymous, it likely dates to the 70s–80s CE rather than 51.",
    significance: "Introduced apocalyptic prerequisites for Christ's return that would shape Christian eschatology for centuries, including medieval and modern speculation about the Antichrist.",
    quote: "Anyone unwilling to work should not eat. — 2 Thessalonians 3:10",
    sources: ["2 Thessalonians", "Malherbe, The Letters to the Thessalonians (Anchor Bible)", "Nicholl, From Hope to Despair in Thessalonica"],
    relatedEvents: ["1 Thessalonians", "Conversion of Paul", "Revelation"],
    canons: ["protestant","catholic","orthodox"]
  },
  {
    year: 63, endYear: 64, label: "1 Timothy", type: "writing-nt", category: "books", subcategory: "pauline-epistles", wiki: "First_Epistle_to_Timothy",
    attributed: "Paul",
    scholarly: "Almost certainly pseudonymous — written by a Pauline disciple, probably in the 80s–100s CE. Roughly 80% of critical scholars reject Pauline authorship.",
    dispute: "High — the vocabulary (306 words not found in the undisputed Paulines), ecclesiology (structured offices of bishop and deacon), and theology (faith as 'deposit' to guard rather than living trust) point strongly to a post-Pauline setting. The Pastoral Epistles as a group represent the most widely rejected traditional attributions in the New Testament after 2 Peter.",
    detail: "Instructions to Timothy on church leadership, sound doctrine, and congregational order, presented as from Paul but widely regarded as pseudonymous. The letter addresses a situation more developed than anything in Paul's lifetime: established church offices, fixed creedal formulas, and an emphasis on 'sound teaching' as a body of doctrine to be preserved rather than a living argument. It provides detailed qualifications for bishops and deacons (ch. 3), rules for enrolling widows (ch. 5), and warnings against false teachers promoting myths and genealogies. The instruction that women should 'learn in silence with full submission' (2:11–12) has been among the most debated passages in Christian history. If pseudonymous, the author wrote to stabilize Pauline churches in the generations after the apostle's death.",
    significance: "Became the primary biblical blueprint for church governance across Christian traditions and the most cited text in debates over women's ordination.",
    quote: "I permit no woman to teach or to have authority over a man; she is to keep silent. — 1 Timothy 2:12",
    sources: ["1 Timothy", "Marshall, The Pastoral Epistles (ICC)", "Collins, 1 & 2 Timothy and Titus (NTL)"],
    relatedEvents: ["2 Timothy", "Titus", "Conversion of Paul"],
    canons: ["protestant","catholic","orthodox"]
  },
  { year: 66, endYear: 67, label: "2 Timothy", type: "writing-nt", category: "books", subcategory: "pauline-epistles", wiki: "Second_Epistle_to_Timothy",
    attributed: "Paul",
    scholarly: "Probably pseudonymous, like the other Pastorals, though its personal details make it the most plausibly Pauline of the three. A minority of scholars argue for genuine Pauline fragments embedded in a later framework.",
    dispute: "Moderate to high — shares the vocabulary and theological profile of 1 Timothy and Titus, but its vivid personal touches (the cloak left at Troas, the request for parchments, the named companions) have led some scholars to posit that a later editor incorporated authentic Pauline notes into a pseudonymous letter.",
    detail: "Presented as Paul's final letter before execution in Rome, urging Timothy to endure suffering, guard the faith, and come quickly before winter. The letter's emotional power derives from its valedictory tone — Paul writes as a man pouring out his life: 'I have fought the good fight, I have finished the race, I have kept the faith' (4:7). It warns that 'all who are in Asia have turned away from me' and names specific opponents and deserters, lending an air of historical specificity unusual for pseudonymous works. The letter also contains the declaration that 'all Scripture is inspired by God' (3:16) — a verse that became foundational for doctrines of biblical inspiration, though in its original context 'Scripture' referred to the Jewish Scriptures, not a New Testament canon that did not yet exist.",
    significance: "Contains the New Testament's most quoted proof-text for biblical inspiration (3:16) and the most moving farewell in the Pauline corpus, shaping Christian ideals of martyrdom and faithful endurance.",
    quote: "I have fought the good fight, I have finished the race, I have kept the faith. — 2 Timothy 4:7",
    sources: ["2 Timothy", "Johnson, The First and Second Letters to Timothy (Anchor Bible)", "Prior, Paul the Letter-Writer and the Second Letter to Timothy"],
    relatedEvents: ["1 Timothy", "Titus", "Conversion of Paul"],
    canons: ["protestant","catholic","orthodox"]
  },
  { year: 63, endYear: 65, label: "Titus", type: "writing-nt", category: "books", subcategory: "pauline-epistles", wiki: "Epistle_to_Titus",
    attributed: "Paul",
    scholarly: "Almost certainly pseudonymous — grouped with 1–2 Timothy as the 'Pastoral Epistles,' which share a distinctive vocabulary, style, and ecclesiastical outlook that differ markedly from the undisputed Paulines.",
    dispute: "High — the same linguistic and theological arguments against Pauline authorship of 1 Timothy apply here. Titus shares over 60% of its vocabulary with 1 Timothy and reflects a similarly institutionalized church structure.",
    detail: "Instructions to Titus on organizing churches in Crete, addressing qualifications for elders, the need for sound teaching, and proper conduct for various social groups. The letter claims Paul left Titus on Crete to 'put in order what remained to be done' and appoint elders in every town (1:5). It includes one of the New Testament's most concise summaries of the gospel: 'the grace of God has appeared, bringing salvation to all' (2:11). The letter also quotes and affirms a negative ethnic stereotype about Cretans (1:12, attributed to the poet Epimenides), a passage that has drawn criticism. Like 1 Timothy, Titus envisions a church settling into institutional stability — appointing qualified leaders, silencing dissenters, and transmitting 'sound doctrine' as a fixed body of teaching.",
    significance: "Completes the Pastoral Epistles' vision of post-apostolic church order and preserves one of the New Testament's most succinct statements of grace-centered salvation.",
    quote: "For the grace of God has appeared, bringing salvation to all. — Titus 2:11",
    sources: ["Titus", "Marshall, The Pastoral Epistles (ICC)", "Quinn, The Letter to Titus (Anchor Bible)"],
    relatedEvents: ["1 Timothy", "2 Timothy", "Conversion of Paul"],
    canons: ["protestant","catholic","orthodox"]
  },
  { year: 61, endYear: 63, label: "Philemon", type: "writing-nt", category: "books", subcategory: "pauline-epistles", wiki: "Epistle_to_Philemon",
    attributed: "Paul",
    scholarly: "Authentically Pauline — virtually undisputed. One of the 'undisputed seven.'",
    dispute: "Very low — the letter's brevity, personal character, and lack of significant theological content give no one reason to question Pauline authorship. It is perhaps the least disputed book in the entire New Testament.",
    detail: "Paul's shortest letter — just 335 words in Greek — a personal appeal to Philemon, a wealthy Christian in Colossae, to receive back his runaway slave Onesimus, whom Paul has converted during his imprisonment. Paul's rhetoric is masterful: he appeals to love rather than commanding by apostolic authority, offers to pay any debt Onesimus owes, and hints broadly that Philemon should free Onesimus entirely ('no longer as a slave but as a beloved brother,' v. 16). Whether Paul is requesting manumission or merely reconciliation has been debated for centuries. The letter became a key text in both pro-slavery and abolitionist arguments — slaveholders noted Paul did not explicitly condemn the institution, while abolitionists emphasized that Paul undermined its logic. It is the only undisputed Pauline letter addressed primarily to an individual.",
    significance: "A test case for whether Paul's theology of radical equality in Christ ('neither slave nor free') was meant to transform social structures or only spiritual status — a question that divided Christians for eighteen centuries.",
    quote: "No longer as a slave but more than a slave, a beloved brother. — Philemon 1:16",
    sources: ["Philemon", "Fitzmyer, The Letter to Philemon (Anchor Bible)", "Barth & Blanke, The Letter to Philemon (ECC)"],
    relatedEvents: ["Colossians", "Conversion of Paul", "Galatians"],
    canons: ["protestant","catholic","orthodox"]
  },

  // ── General Epistles (remaining) ──
  { year: 90, endYear: 95, label: "1 John", type: "writing-nt", category: "books", subcategory: "general-epistles", wiki: "First_Epistle_of_John",
    attributed: "John the Apostle",
    scholarly: "Anonymous — likely by a leader in the Johannine community, possibly the same 'Elder' who wrote 2–3 John. Probably not the author of the Fourth Gospel, though closely related theologically and linguistically.",
    dispute: "Moderate — 1 John shares extensive vocabulary and theology with the Gospel of John, but differences in grammar and emphasis suggest a different hand, perhaps a disciple of the Gospel's author. The letter never names its author.",
    detail: "A community letter from the Johannine tradition addressing a church torn apart by a schism — 'they went out from us, but they did not belong to us' (2:19). The secessionists apparently denied that Jesus came 'in the flesh' (an early form of Docetism) and claimed moral perfection while neglecting love of neighbor. In response, the author develops three interlocking tests of authentic Christian life: right belief (Jesus came in the flesh), right conduct (keeping the commandments), and right love (laying down one's life for others). The letter's central theological declaration — 'God is love' (4:8, 16) — is among the most quoted in all of Scripture. Unlike a typical letter, 1 John has no greeting, no named recipients, and no closing — it reads more like a homily or theological tract.",
    significance: "Provides the New Testament's most sustained meditation on the nature of divine love and became the primary proof-text against Docetism and later Christological heresies that denied Christ's full humanity.",
    quote: "God is love, and those who abide in love abide in God, and God abides in them. — 1 John 4:16",
    sources: ["1 John", "Brown, The Epistles of John (Anchor Bible)", "Lieu, I, II, & III John (NTL)"],
    relatedEvents: ["Gospel of John", "2 John", "3 John"],
    canons: ["protestant","catholic","orthodox"]
  },
  { year: 90, endYear: 95, label: "2 John", type: "writing-nt", category: "books", subcategory: "general-epistles", wiki: "Second_Epistle_of_John",
    attributed: "John the Apostle",
    scholarly: "Written by someone calling himself 'the Elder' — likely a leader in the Johannine community, probably the same author as 3 John. Identification with John the Apostle is traditional but uncertain.",
    dispute: "Moderate — the self-designation 'the Elder' rather than 'the Apostle' suggests someone other than John son of Zebedee. Eusebius distinguished between 'John the Apostle' and 'John the Elder' as two separate figures. The letter's place in the canon was debated into the fourth century.",
    detail: "A brief letter of just thirteen verses — the shortest book in the New Testament by word count — from 'the Elder' to 'the elect lady and her children,' probably a house church rather than an individual. The letter warns against offering hospitality to traveling teachers who 'do not confess that Jesus Christ has come in the flesh' (v. 7), calling such a person 'the deceiver and the antichrist.' This instruction reveals a practical mechanism of early church discipline: denying hospitality effectively silenced itinerant teachers, since they depended on local congregations for lodging and support. The letter condenses the theology of 1 John into its most compact form — walking in truth, loving one another, and guarding against Christological error.",
    significance: "Offers a rare glimpse into how early Christian communities enforced doctrinal boundaries through the practical mechanism of hospitality, and preserves the Johannine community's struggle against proto-Gnostic teachers.",
    quote: "Many deceivers have gone out into the world, those who do not confess that Jesus Christ has come in the flesh; any such person is the deceiver and the antichrist! — 2 John 1:7",
    sources: ["2 John", "Brown, The Epistles of John (Anchor Bible)", "Lieu, I, II, & III John (NTL)"],
    relatedEvents: ["1 John", "3 John", "Gospel of John"],
    canons: ["protestant","catholic","orthodox"]
  },
  { year: 90, endYear: 95, label: "3 John", type: "writing-nt", category: "books", subcategory: "general-epistles", wiki: "Third_Epistle_of_John",
    attributed: "John the Apostle",
    scholarly: "Written by 'the Elder' — almost certainly the same author as 2 John. Identification with John the Apostle is traditional but uncertain.",
    dispute: "Moderate — the same authorship questions as 2 John apply. Its canonical status was among the most contested of the Catholic Epistles, with Eusebius listing it among the 'disputed' books.",
    detail: "A personal note of just fifteen verses from 'the Elder' to a man named Gaius, commending him for his hospitality to traveling missionaries and condemning a certain Diotrephes, who 'likes to put himself first' and refuses to welcome the Elder's emissaries. The letter provides an unvarnished snapshot of a power struggle within the early Johannine community — Diotrephes may represent an emerging monarchical bishop asserting local authority against the older, more fluid network of itinerant leaders. A third figure, Demetrius, is recommended as trustworthy. Unlike 1 and 2 John, this letter contains no explicit theological argument — it is entirely about church politics and personal relationships. Its survival is remarkable given its brevity and lack of doctrinal content.",
    significance: "Provides the most candid evidence in the New Testament for internal church conflict over authority, foreshadowing the transition from charismatic itinerant leadership to settled institutional governance.",
    quote: "Beloved, do not imitate what is evil but imitate what is good. Whoever does good is from God; whoever does evil has not seen God. — 3 John 1:11",
    sources: ["3 John", "Brown, The Epistles of John (Anchor Bible)", "Lieu, I, II, & III John (NTL)"],
    relatedEvents: ["1 John", "2 John", "Gospel of John"],
    canons: ["protestant","catholic","orthodox"]
  }
];

/* ─────────── Modern dark palette — vivid inks on warm near-black ─────────── */
const TYPE_CONFIG = {
  "event":            { ink: "#F5A524", glow: "#F5A52466", label: "History",    short: "HIST" },
  "writing-ot":       { ink: "#34D399", glow: "#34D39966", label: "OT Writings", short: "OT" },
  "writing-nt":       { ink: "#60A5FA", glow: "#60A5FA66", label: "NT Writings", short: "NT" },
  "writing-deuterocanon": { ink: "#FB923C", glow: "#FB923C66", label: "Deuterocanon", short: "DC" },
  "writing-noncanon": { ink: "#C084FC", glow: "#C084FC66", label: "Apocrypha",   short: "APOC" },
  "canon":            { ink: "#FB7185", glow: "#FB718566", label: "Canon",       short: "CAN" }
};

/* ═══════════════ HIERARCHICAL CATEGORY TAXONOMY ═══════════════ */
const CATEGORIES = {
  "biblical-events": {
    label: "Biblical Events",
    color: "#F5A524",
    subcategories: {
      "creation-patriarchs":     { label: "Creation & Patriarchs" },
      "egypt-exodus":            { label: "Egypt & Exodus" },
      "conquest-judges":         { label: "Conquest & Judges" },
      "united-kingdom":          { label: "United Kingdom" },
      "divided-kingdom":         { label: "Divided Kingdom & Prophets" },
      "exile-babylon":           { label: "Exile & Babylonian Period" },
      "return-restoration":      { label: "Return & Restoration" },
      "intertestamental":        { label: "Intertestamental Period" },
      "life-of-christ":          { label: "Life of Christ" },
      "early-church":            { label: "Early Church & Acts" },
      "epistles-period":         { label: "Epistles Period" },
      "revelation-era":          { label: "Revelation & Late Writings" },
    }
  },
  "books": {
    label: "Books of the Bible",
    color: "#34D399",
    subcategories: {
      "torah":                   { label: "Torah / Pentateuch" },
      "historical-books":        { label: "Historical Books" },
      "wisdom-poetry":           { label: "Wisdom & Poetry" },
      "major-prophets":          { label: "Major Prophets" },
      "minor-prophets":          { label: "Minor Prophets" },
      "deuterocanonical-books":  { label: "Deuterocanonical" },
      "gospels":                 { label: "Gospels" },
      "acts":                    { label: "Acts" },
      "pauline-epistles":        { label: "Pauline Epistles" },
      "general-epistles":        { label: "General Epistles" },
      "apocalyptic-book":        { label: "Apocalyptic" },
      "ot-sources":              { label: "OT Source Hypotheses" },
      "non-canonical":           { label: "Non-Canonical" },
    }
  },
  "canon-formation": {
    label: "Canon Formation",
    color: "#FB7185",
    subcategories: {
      "jewish-canon":            { label: "Jewish Canon" },
      "early-christian-canon":   { label: "Early Christian Canon" },
      "council-decisions":       { label: "Council Decisions" },
      "reformation-canon":       { label: "Reformation Canon" },
      "modern-discoveries":      { label: "Modern Discoveries" },
    }
  }
};

// Build a flat set of all subcategory keys for default filter state
const ALL_SUBCATEGORY_KEYS = Object.values(CATEGORIES).flatMap(
  cat => Object.keys(cat.subcategories)
);

// Default subcategories shown on initial load (the curated "overview" set)
const DEFAULT_ACTIVE_SUBCATEGORIES = new Set([
  // Biblical events — main periods
  "creation-patriarchs", "egypt-exodus", "conquest-judges", "united-kingdom",
  "divided-kingdom", "exile-babylon", "return-restoration", "intertestamental",
  "life-of-christ", "early-church", "epistles-period", "revelation-era",
  // Books — existing writing types
  "ot-sources", "non-canonical",
  // Canon formation — all
  "jewish-canon", "early-christian-canon", "council-decisions",
  "reformation-canon", "modern-discoveries",
]);

/* ═══════════════ GLOSSARY ═══════════════
   Scholarly terms that auto-highlight in Reader prose.
   Click a highlighted term to open a definition popover.
*/
const GLOSSARY = {
  "Documentary Hypothesis": {
    definition: "The scholarly theory that the Pentateuch (Genesis–Deuteronomy) was assembled from four originally independent sources — J, E, D, and P — written at different times and later woven together by editors. Proposed by Julius Wellhausen in the 1870s, it remains the dominant academic framework for Pentateuchal composition, though many details are debated.",
    related: ["J Source", "E Source", "Priestly source", "Deuteronomist", "Pentateuch"]
  },
  "J Source": {
    aliases: ["Yahwist"],
    wiki: "Jahwist",
    definition: "The hypothetical earliest Pentateuchal strand, named for its use of the divine name YHWH (rendered 'Jahveh' in 19th-century German scholarship). J portrays God in vivid, anthropomorphic terms and likely originated in the southern kingdom of Judah around 950–900 BCE.",
    related: ["Documentary Hypothesis", "E Source", "Priestly source"]
  },
  "E Source": {
    aliases: ["Elohist"],
    wiki: "Elohist",
    definition: "A hypothetical Pentateuchal source identified by its use of 'Elohim' for God rather than YHWH, and its more distant portrayal of God communicating through dreams and angels. Likely composed in the northern kingdom of Israel around 850–800 BCE; some scholars question whether it ever existed as an independent document.",
    related: ["Documentary Hypothesis", "J Source", "Priestly source"]
  },
  "Priestly source": {
    aliases: ["Priestly Source", "Priestly", "P source"],
    definition: "The Pentateuchal strand identified by its formal, elevated prose, genealogies, ritual detail, and concern with Temple worship. Composed by priestly scribes during and after the Babylonian Exile (6th–5th c. BCE), P contributed Genesis 1, Leviticus, and much of the legal material of the Torah.",
    related: ["Documentary Hypothesis", "Babylonian Exile", "Pentateuch"]
  },
  "Deuteronomist": {
    aliases: ["Deuteronomistic"],
    definition: "The anonymous author(s) of the core of Deuteronomy, likely reforming priests or Levites in late 7th-century BCE Judah. The Deuteronomist's theology — covenant loyalty, centralized worship, reward-for-obedience — became the interpretive framework for the 'Deuteronomistic History' (Joshua through 2 Kings).",
    related: ["Documentary Hypothesis", "Pentateuch"]
  },
  "Pentateuch": {
    aliases: ["Torah"],
    definition: "The first five books of the Hebrew Bible — Genesis, Exodus, Leviticus, Numbers, and Deuteronomy. Traditionally attributed to Moses; critical scholars view them as a composite of multiple sources woven together over centuries. Called 'Torah' (instruction/law) in Jewish tradition and 'Pentateuch' (five scrolls) in Greek Christian usage."
  },
  "Septuagint": {
    aliases: ["LXX"],
    definition: "The Greek translation of the Hebrew Bible produced in Alexandria starting around 250 BCE. Named for the legendary 72 translators (LXX = Roman numeral 70). It became the standard scripture of diaspora Judaism and the early Christian church — most New Testament Old Testament quotations come from it, not the Hebrew."
  },
  "pseudepigraphy": {
    aliases: ["pseudepigraphic", "pseudonymous"],
    wiki: "Pseudepigrapha",
    definition: "The ancient practice of writing a text under the name of a revered figure (often an apostle or prophet) who did not actually author it. In antiquity this was sometimes an act of homage or continuation of a teacher's tradition, not necessarily forgery — though the categories were contested even then.",
    related: ["Deutero-Pauline"]
  },
  "Deutero-Pauline": {
    wiki: "Authorship_of_the_Pauline_epistles",
    definition: "A scholarly category for New Testament letters (Colossians, Ephesians, 2 Thessalonians) that claim Paul as author but whose style, vocabulary, and theology differ enough from his 'undisputed seven' that many scholars attribute them to Pauline followers writing after his death.",
    related: ["pseudepigraphy", "Pastoral Epistles"]
  },
  "Synoptic Gospels": {
    aliases: ["Synoptic", "Synoptics"],
    definition: "Matthew, Mark, and Luke — the three Gospels that share substantial overlapping material and can be set side-by-side ('seen together,' Greek *synoptikos*). John differs so much in content, chronology, and style that it stands apart.",
    related: ["Q source"]
  },
  "Q source": {
    aliases: ["Quelle", "Q"],
    definition: "A hypothetical lost collection of Jesus's sayings that scholars posit as a second source (alongside Mark) used by Matthew and Luke. From the German *Quelle*, 'source.' Q has never been found, but its reconstructed content accounts for the material Matthew and Luke share that is absent from Mark.",
    related: ["Synoptic Gospels"]
  },
  "vaticinium ex eventu": {
    definition: "Latin for 'prophecy from the event' — a literary device where a text written after historical events portrays them as prophesied beforehand. Critical scholars identify it in Daniel 7–12, whose detailed 'predictions' of the Maccabean crisis (~165 BCE) are strikingly accurate up to that point, then become vague about what follows."
  },
  "apocalyptic": {
    wiki: "Apocalyptic_literature",
    definition: "A genre of Jewish and Christian literature (~250 BCE – 150 CE) featuring symbolic visions, heavenly journeys, cosmic battles, and the imminent end of the current world order. Daniel and Revelation are the canonical examples; 1 Enoch and 4 Ezra are important non-canonical apocalypses.",
    related: ["eschatology"]
  },
  "Gnostic": {
    aliases: ["Gnosticism"],
    wiki: "Gnosticism",
    definition: "A diverse 2nd–4th century religious movement claiming salvation through secret knowledge (*gnosis*) of one's divine origin. Gnostic Christianity typically viewed the material world as the flawed creation of a lesser deity and Jesus as a divine messenger bringing liberating knowledge. Condemned as heresy by proto-orthodox bishops; many Gnostic texts survive from the Nag Hammadi library."
  },
  "Docetism": {
    aliases: ["docetic"],
    definition: "The early Christian view that Jesus only *appeared* to have a physical body and to suffer on the cross — that as a divine being, he could not truly experience flesh or death. From the Greek *dokein*, 'to seem.' Orthodoxy rejected docetism forcefully (1 John 4:2 is often read as an anti-docetic creed)."
  },
  "Masoretes": {
    aliases: ["Masoretic"],
    definition: "Jewish scribal scholars (primarily in Tiberias, 7th–10th centuries CE) who fixed the Hebrew Bible text by adding vowel markings, cantillation marks, and marginal notes. Before the Masoretes, Hebrew was written without vowels. Nearly all modern Hebrew Bibles descend from their work."
  },
  "Vulgate": {
    definition: "Jerome's Latin translation of the Bible, produced ~382–405 CE and commissioned by Pope Damasus I. Named from *vulgata* ('common'), it became the standard Bible of Western Christianity for over a thousand years and was declared the authoritative Catholic text at the Council of Trent."
  },
  "antilegomena": {
    definition: "Greek for 'spoken against' — Eusebius's 4th-century category for early Christian books that were widely read but whose canonical status was disputed. His list included James, 2 Peter, 2–3 John, Jude, and Revelation. Contrast with *homologoumena* ('agreed upon'), the books accepted universally."
  },
  "homologoumena": {
    definition: "Greek for 'agreed upon' — Eusebius's category for early Christian books whose canonical authority was universally accepted by the 4th-century church: the four Gospels, Acts, the letters of Paul, 1 Peter, and 1 John."
  },
  "amanuensis": {
    aliases: ["amanuenses"],
    definition: "A secretary or scribe who takes dictation from an author. In antiquity, most letters were dictated rather than written directly — Paul explicitly names Tertius as the amanuensis of Romans (Romans 16:22). The practice complicates authorship debates: a letter 'from Peter through Silvanus' may reflect Silvanus's Greek prose."
  },
  "Hasmonean": {
    aliases: ["Hasmoneans"],
    wiki: "Hasmonean_dynasty",
    definition: "The priestly dynasty founded by the Maccabees that ruled an independent Jewish state from 140 to 37 BCE, after their successful revolt against Seleucid rule. Internally fractious and increasingly Hellenized, the Hasmonean line ended when Rome installed Herod the Great.",
    related: ["Maccabean Revolt"]
  },
  "diaspora": {
    wiki: "Jewish_diaspora",
    definition: "The dispersion of Jewish communities outside the land of Israel, especially after the Babylonian Exile (586 BCE) and again after the Roman destruction of the Temple (70 CE). Greek-speaking diaspora Jews in Alexandria produced the Septuagint; they were also the first audience for Paul's missionary work."
  },
  "deuterocanonical": {
    aliases: ["Apocrypha"],
    wiki: "Deuterocanonical_books",
    definition: "Books accepted in Catholic and Orthodox Old Testaments but excluded from Protestant Bibles — Tobit, Judith, Wisdom of Solomon, Sirach, Baruch, 1–2 Maccabees, and additions to Esther and Daniel. 'Deuterocanonical' (Catholic term) means 'second canon'; Protestants call them 'Apocrypha' and treat them as non-scriptural."
  },
  "Hellenization": {
    aliases: ["Hellenistic"],
    definition: "The spread of Greek language, culture, philosophy, and civic institutions across the eastern Mediterranean following Alexander the Great's conquests (332 BCE onward). Hellenization shaped Jewish life profoundly — producing the Septuagint, the conditions for the Maccabean Revolt, and eventually the Greek-language New Testament."
  },
  "eschatology": {
    aliases: ["eschatological"],
    wiki: "Christian_eschatology",
    definition: "The branch of theology concerned with 'last things' — death, judgment, resurrection, the end of the age, and the ultimate destiny of humanity. From Greek *eschatos*, 'last.' Jewish apocalyptic and early Christianity were intensely eschatological, expecting imminent divine intervention.",
    related: ["apocalyptic"]
  },
  "Christology": {
    aliases: ["Christological"],
    definition: "The theological study of the person and nature of Jesus Christ — especially the relationship between his divinity and humanity. Early Christological debates (Arianism, Docetism, Nestorianism) drove the great ecumenical councils of the 4th–7th centuries.",
    related: ["Arianism", "homoousios"]
  },
  "homoousios": {
    wiki: "Homoousion",
    definition: "Greek for 'of the same substance' — the key term in the Nicene Creed (325 CE) declaring that Christ is of identical divine essence with God the Father, not a lesser created being. The word was controversial because it was non-biblical, but it became the defining marker of Nicene orthodoxy against Arianism.",
    related: ["Arianism", "Christology"]
  },
  "Arianism": {
    definition: "The 4th-century view — taught by the Alexandrian priest Arius — that Jesus the Son was created by the Father and is therefore subordinate and not co-eternal with God. Condemned at the Council of Nicaea (325), Arianism nevertheless remained influential for over a century, especially among Germanic tribes.",
    related: ["homoousios", "Christology"]
  },
  "Pharisee": {
    aliases: ["Pharisees", "Pharisaic"],
    wiki: "Pharisees",
    definition: "A Second Temple Jewish movement emphasizing strict observance of Torah, oral tradition, and personal piety. Often depicted antagonistically in the Gospels, Pharisees were in fact the ancestors of rabbinic Judaism and shared much common ground with Jesus. Paul identifies himself as a Pharisee before his conversion."
  },
  "Essenes": {
    definition: "A Jewish sectarian group of the Second Temple period (2nd c. BCE – 1st c. CE) known for communal living, ritual purity, and apocalyptic expectation. Most scholars identify the community at Qumran — who produced the Dead Sea Scrolls — as Essenes or an Essene-adjacent group.",
    related: ["diaspora"]
  }
};

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const GLOSSARY_INDEX = (() => {
  const idx = {};
  for (const [canonical, entry] of Object.entries(GLOSSARY)) {
    idx[canonical.toLowerCase()] = canonical;
    for (const alias of entry.aliases || []) {
      idx[alias.toLowerCase()] = canonical;
    }
  }
  return idx;
})();

const GLOSSARY_PATTERN = (() => {
  const keys = Object.keys(GLOSSARY_INDEX).sort((a, b) => b.length - a.length);
  return new RegExp(`\\b(${keys.map(escapeRegex).join("|")})\\b`, "gi");
})();

function highlightTerms(text, onTermClick) {
  if (!text || typeof text !== "string") return text;
  const parts = [];
  let lastIdx = 0;
  let match;
  let n = 0;
  GLOSSARY_PATTERN.lastIndex = 0;
  while ((match = GLOSSARY_PATTERN.exec(text)) !== null) {
    if (match.index > lastIdx) parts.push(text.slice(lastIdx, match.index));
    const canonical = GLOSSARY_INDEX[match[0].toLowerCase()];
    const clicked = match[0]; // preserve the exact text the user clicked
    parts.push(
      <button
        key={`gt-${n++}-${match.index}`}
        type="button"
        className="bt-glossary-term"
        onClick={(e) => { e.stopPropagation(); onTermClick(canonical, clicked, e); }}
      >{clicked}</button>
    );
    lastIdx = match.index + match[0].length;
  }
  if (lastIdx < text.length) parts.push(text.slice(lastIdx));
  return parts;
}

// Build a Wikipedia article URL. Accepts an explicit slug or falls back to a
// capitalised-underscored slug derived from the term name. Wikipedia's redirects
// handle most near-matches.
const wikiUrl = (termOrSlug, explicit) => {
  const slug = explicit || String(termOrSlug).trim().replace(/\s+/g, "_");
  return `https://en.wikipedia.org/wiki/${encodeURIComponent(slug)}`;
};

/* ─── Canon tradition system ─── */
const CANON_LABELS = {
  jewish:     "Jewish",
  protestant: "Protestant",
  catholic:   "Catholic",
  orthodox:   "Orthodox"
};
// Default canons by writing type — entries can override with explicit `canons` field
const CANON_DEFAULTS = {
  "writing-ot":           ["jewish", "protestant", "catholic", "orthodox"],
  "writing-nt":           ["protestant", "catholic", "orthodox"],
  "writing-deuterocanon": ["catholic", "orthodox"],
  "writing-noncanon":     [],
};

// Compute bounds from actual data so nothing can fall outside the SVG
const _dataMinYr = Math.min(
  ...TIMELINE_DATA.map(d => Math.min(d.year, d.storyStart ?? d.year))
);
const MIN_YR = Math.floor(_dataMinYr / 100) * 100 - 200; // pad 200 years before earliest
const MAX_YR = 2050;
const SPAN = MAX_YR - MIN_YR;
const MIN_VIS_SPAN = 60;
const MAX_VIS_SPAN = SPAN;

const fmtYr = (y) => {
  const r = Math.round(y);
  if (r < 0) return `${Math.abs(r)} BCE`;
  if (r === 0) return "1 CE";
  return `${r} CE`;
};
const fmtYrShort = (y) => {
  const r = Math.round(y);
  if (r < 0) return `${Math.abs(r)}B`;
  return `${r}`;
};
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

export default function BiblicalTimeline() {
  // Hierarchical filter state
  const [activeSubs, setActiveSubs] = useState(() => new Set(DEFAULT_ACTIVE_SUBCATEGORIES));
  const [activeTraditions, setActiveTraditions] = useState(() => new Set(["jewish", "protestant", "catholic", "orthodox"]));
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [soloView, setSoloView] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  const [selectedKey, setSelectedKey] = useState(null);
  // Initial view fits the default visible data (not the full coordinate range)
  const [viewStart, setViewStart] = useState(() => {
    const defaultData = TIMELINE_DATA.filter(d =>
      DEFAULT_ACTIVE_SUBCATEGORIES.has(d.subcategory)
    );
    if (defaultData.length === 0) return MIN_YR;
    const earliest = Math.min(...defaultData.map(d => d.year));
    return Math.floor(earliest / 100) * 100 - 150;
  });
  const [viewEnd, setViewEnd] = useState(MAX_YR);
  const [hover, setHover] = useState(null);
  const [hoveredKey, setHoveredKey] = useState(null);
  const [clusterMenu, setClusterMenu] = useState(null);
  const [glossaryPopover, setGlossaryPopover] = useState(null);

  const wrapRef = useRef(null);
  const scrollRef = useRef(null);
  const [wrapW, setWrapW] = useState(() =>
    typeof window !== "undefined" ? Math.max(600, window.innerWidth - 56) : 1080
  );
  const [mainH, setMainH] = useState(() =>
    typeof window !== "undefined" ? Math.max(320, window.innerHeight - 260) : 420
  );
  const suppressScroll = useRef(false);
  const rafRef = useRef(0);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => {
      setWrapW(el.clientWidth);
      setMainH(el.clientHeight);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Filter helpers
  const toggleSub = useCallback((sub) => setActiveSubs(p => {
    const n = new Set(p); n.has(sub) ? n.delete(sub) : n.add(sub); return n;
  }), []);
  const soloSub = useCallback((sub) => {
    setActiveSubs(new Set([sub]));
    setSelectedKey(null);
    setClusterMenu(null);
  }, []);
  const setGroupSubs = useCallback((catKey, mode) => {
    // mode: "all" = add all subs, "none" = remove all subs
    const subs = Object.keys(CATEGORIES[catKey].subcategories);
    setActiveSubs(p => {
      const n = new Set(p);
      subs.forEach(s => mode === "all" ? n.add(s) : n.delete(s));
      return n;
    });
  }, []);
  const toggleTradition = useCallback((t) => setActiveTraditions(p => {
    const n = new Set(p); n.has(t) ? n.delete(t) : n.add(t); return n;
  }), []);
  const resetFilters = useCallback(() => {
    setActiveSubs(new Set(DEFAULT_ACTIVE_SUBCATEGORIES));
    setActiveTraditions(new Set(["jewish", "protestant", "catholic", "orthodox"]));
  }, []);

  const isDefaultFilters = useMemo(() => {
    if (activeSubs.size !== DEFAULT_ACTIVE_SUBCATEGORIES.size) return false;
    for (const s of DEFAULT_ACTIVE_SUBCATEGORIES) { if (!activeSubs.has(s)) return false; }
    return activeTraditions.size === 4;
  }, [activeSubs, activeTraditions]);

  // Filter data: visible if subcategory is active AND (has no canons, or at least one canon matches active traditions)
  const data = useMemo(() => {
    // Solo view: show only the selected item
    if (soloView && selectedKey) {
      const item = TIMELINE_DATA.find(d => `${d.label}-${d.year}` === selectedKey);
      return item ? [item] : [];
    }
    return TIMELINE_DATA.filter(d => {
      if (!activeSubs.has(d.subcategory)) return false;
      const canons = d.canons || CANON_DEFAULTS[d.type] || [];
      if (canons.length === 0) return true;
      return canons.some(c => activeTraditions.has(c));
    }).sort((a, b) => a.year - b.year);
  }, [activeSubs, activeTraditions, soloView, selectedKey]);

  const visSpan = viewEnd - viewStart;
  // Pixel-based edge padding — events never clip at the left/right edges regardless of zoom
  const EDGE_PAD = 140;
  const usableW = Math.max(200, wrapW - 2 * EDGE_PAD);
  const pxPerYear = usableW / visSpan;
  const svgWidth = SPAN * pxPerYear + 2 * EDGE_PAD;
  const yearToSvgX = (y) => EDGE_PAD + (y - MIN_YR) * pxPerYear;

  /* ─── Animated view transitions ─── */
  const cancelAnim = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
  };
  const animateView = useCallback((targetStart, targetEnd, duration = 460) => {
    cancelAnim();
    const fromStart = viewStart, fromEnd = viewEnd;
    const t0 = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - t0) / duration);
      const e = easeOutCubic(t);
      suppressScroll.current = true;
      setViewStart(fromStart + (targetStart - fromStart) * e);
      setViewEnd(fromEnd + (targetEnd - fromEnd) * e);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        rafRef.current = 0;
        requestAnimationFrame(() => { suppressScroll.current = false; });
      }
    };
    rafRef.current = requestAnimationFrame(step);
  }, [viewStart, viewEnd]);

  /* ─── Scroll sync (padded coord system: scrollLeft = (viewStart - MIN_YR) * pxPerYear) ─── */
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const target = (viewStart - MIN_YR) * pxPerYear;
    if (Math.abs(el.scrollLeft - target) > 0.5) {
      suppressScroll.current = true;
      el.scrollLeft = target;
      requestAnimationFrame(() => {
        if (!rafRef.current) suppressScroll.current = false;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewStart, pxPerYear]);

  const onMainScroll = useCallback((e) => {
    if (suppressScroll.current) return;
    cancelAnim();
    const el = e.currentTarget;
    const ns = MIN_YR + el.scrollLeft / pxPerYear;
    const clamped = clamp(ns, MIN_YR, MAX_YR - visSpan);
    setViewStart(clamped);
    setViewEnd(clamped + visSpan);
  }, [pxPerYear, visSpan]);

  const zoomAt = useCallback((yearCenter, newSpan) => {
    cancelAnim();
    newSpan = clamp(newSpan, MIN_VIS_SPAN, MAX_VIS_SPAN);
    const ratio = (yearCenter - viewStart) / visSpan;
    let ns = yearCenter - newSpan * ratio;
    ns = clamp(ns, MIN_YR, MAX_YR - newSpan);
    setViewStart(ns);
    setViewEnd(ns + newSpan);
  }, [viewStart, visSpan]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handler = (e) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      // Cursor position in svg coordinates (accounting for scroll + edge pad)
      const mx = e.clientX - rect.left + el.scrollLeft;
      const yearAtCursor = MIN_YR + (mx - EDGE_PAD) / pxPerYear;
      const factor = Math.exp(e.deltaY * 0.012);
      zoomAt(yearAtCursor, visSpan * factor);
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, [pxPerYear, visSpan, zoomAt]);

  const zoomBy = (factor) => {
    const c = (viewStart + viewEnd) / 2;
    const target = clamp(visSpan * factor, MIN_VIS_SPAN, MAX_VIS_SPAN);
    const ratio = 0.5;
    let ns = c - target * ratio;
    ns = clamp(ns, MIN_YR, MAX_YR - target);
    animateView(ns, ns + target, 280);
  };
  const resetView = useCallback(() => {
    // Fit to the currently visible data, not the full coordinate range
    if (data.length === 0) { animateView(MIN_YR, MAX_YR, 520); return; }
    const earliest = Math.min(...data.map(d => Math.min(d.year, d.storyStart ?? d.year)));
    const latest = Math.max(...data.map(d => Math.max(d.endYear || d.year, d.storyEnd ?? d.year)));
    const pad = Math.max((latest - earliest) * 0.08, 100);
    animateView(
      Math.max(MIN_YR, Math.floor(earliest - pad)),
      Math.min(MAX_YR, Math.ceil(latest + pad)),
      520
    );
  }, [data, animateView]);

  const zoomToRange = (yMin, yMax) => {
    const range = yMax - yMin;
    const pad = Math.max(range * 0.4, 25);
    let ns = yMin - pad;
    let ne = yMax + pad;
    if (ne - ns < MIN_VIS_SPAN) {
      const c = (ns + ne) / 2;
      ns = c - MIN_VIS_SPAN / 2;
      ne = c + MIN_VIS_SPAN / 2;
    }
    ns = clamp(ns, MIN_YR, MAX_YR - (ne - ns));
    ne = ns + (ne - ns);
    animateView(ns, ne, 540);
  };

  const ensureVisible = (year) => {
    const pad = visSpan * 0.15;
    if (year < viewStart + pad) {
      const ns = clamp(year - pad, MIN_YR, MAX_YR - visSpan);
      animateView(ns, ns + visSpan, 300);
    } else if (year > viewEnd - pad) {
      const ne = clamp(year + pad, MIN_YR + visSpan, MAX_YR);
      animateView(ne - visSpan, ne, 300);
    }
  };

  /* ─── Keyboard ─── */
  useEffect(() => {
    const onKey = (e) => {
      if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;
      if (e.key === "Escape") { setSelectedKey(null); setSoloView(false); return; }
      if (e.key === "+" || e.key === "=") { e.preventDefault(); zoomBy(0.65); return; }
      if (e.key === "-" || e.key === "_") { e.preventDefault(); zoomBy(1.55); return; }
      if (e.key === "0") { e.preventDefault(); resetView(); return; }
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        const dir = e.key === "ArrowRight" ? 1 : -1;
        const idx = data.findIndex(d => `${d.label}-${d.year}` === selectedKey);
        const next = idx === -1
          ? (dir > 0 ? data[0] : data[data.length - 1])
          : data[clamp(idx + dir, 0, data.length - 1)];
        if (next) {
          setSelectedKey(`${next.label}-${next.year}`);
          ensureVisible(next.year);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKey, data, visSpan, viewStart, viewEnd]);

  /* ─── Cluster detection (STABLE — computed from full data, filter only affects visibility) ─── */
  const CLUSTER_DIST = 28;
  const groupsAll = useMemo(() => {
    const items = TIMELINE_DATA
      .map(d => ({ ...d, x: yearToSvgX(d.year), key: `${d.label}-${d.year}` }))
      .sort((a, b) => a.x - b.x);
    const result = [];
    for (const it of items) {
      const last = result[result.length - 1];
      const lastHasPinned = last && last.items.some(i => i.pin);
      // Pinned events never join any cluster, and nothing ever joins a pinned event's group
      const canMerge = last && !it.pin && !lastHasPinned && it.x - last.lastX < CLUSTER_DIST;
      if (canMerge) {
        last.items.push(it);
        last.lastX = it.x;
        if (it.year < last.minYr) last.minYr = it.year;
        const endY = it.endYear || it.year;
        if (endY > last.maxYr) last.maxYr = endY;
      } else {
        result.push({
          items: [it],
          firstX: it.x,
          lastX: it.x,
          minYr: it.year,
          maxYr: it.endYear || it.year,
        });
      }
    }
    return result.map((g, i) => ({
      items: g.items,
      anchorX: (g.firstX + g.lastX) / 2,
      minYr: g.minYr,
      maxYr: g.maxYr,
      isPinned: g.items.length === 1 && g.items[0].pin === true,
      groupKey: `grp-${i}-${g.items[0].key}`,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pxPerYear]);

  /* ─── Slot placement (STABLE — computed from full groups, never depends on filter) ─── */
  const effMainH = Math.max(240, mainH);
  const AXIS_Y = Math.round(effMainH / 2);
  // Dynamic slot offsets: scale to fit container so labels never clip
  const availTop = AXIS_Y - 48;                  // leave top margin
  const availBot = effMainH - AXIS_Y - 56;       // leave room for era labels
  const outerOff = Math.max(44, Math.min(96, Math.min(availTop, availBot)));
  const innerOff = Math.max(26, Math.round(outerOff * 0.56));
  const SLOT_OFFSETS = [-innerOff, innerOff, -outerOff, outerOff];
  const placedAll = useMemo(() => {
    const entries = groupsAll.map(g => ({
      ...g,
      labelW: g.items.length === 1
        ? Math.min(g.items[0].label.length * 6.8 + 28, 220)
        : 86,
    }));
    const slotRights = [-Infinity, -Infinity, -Infinity, -Infinity];
    // Pinned events get first pick at slot 0 (closest to axis, most visible)
    const pinned = entries.filter(e => e.isPinned);
    const others = entries.filter(e => !e.isPinned);
    pinned.forEach(e => {
      // Pinned events always take the closest free slot, prefer slot 0/1
      const leftEdge = e.anchorX - e.labelW / 2;
      let s = -1;
      for (let i = 0; i < 4; i++) {
        if (leftEdge > slotRights[i] + 10) { s = i; break; }
      }
      if (s === -1) s = 0;
      e.slot = s;
      slotRights[s] = e.anchorX + e.labelW / 2;
    });
    others.forEach(e => {
      const leftEdge = e.anchorX - e.labelW / 2;
      let s = -1;
      for (let i = 0; i < 4; i++) {
        if (leftEdge > slotRights[i] + 10) { s = i; break; }
      }
      if (s === -1) s = 3;
      e.slot = s;
      slotRights[s] = e.anchorX + e.labelW / 2;
    });
    return entries;
  }, [groupsAll]);

  /* ─── Apply filter (visibility only, positions are stable) ─── */
  const dataKeys = useMemo(() => new Set(data.map(d => `${d.label}-${d.year}`)), [data]);
  const placedFiltered = useMemo(() => {
    return placedAll
      .map(e => {
        const visible = e.items.filter(i => dataKeys.has(i.key));
        return { ...e, visible, visibleCount: visible.length };
      })
      .filter(e => e.visibleCount > 0);
  }, [placedAll, dataKeys]);

  /* ─── Virtualize to viewport ─── */
  const visibleEntries = useMemo(() => {
    const lo = yearToSvgX(viewStart) - 320;
    const hi = yearToSvgX(viewEnd) + 320;
    return placedFiltered.filter(e => e.anchorX >= lo && e.anchorX <= hi);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placedFiltered, viewStart, viewEnd, svgWidth]);

  /* ─── Reorder so hovered entry renders last (on top via SVG painter order) ─── */
  const renderEntries = useMemo(() => {
    if (!hoveredKey) return visibleEntries;
    const idx = visibleEntries.findIndex(e => e.groupKey === hoveredKey);
    if (idx < 0) return visibleEntries;
    const copy = [...visibleEntries];
    const [h] = copy.splice(idx, 1);
    copy.push(h);
    return copy;
  }, [visibleEntries, hoveredKey]);

  /* ─── Era gridlines adaptive ─── */
  const eras = useMemo(() => {
    const span = visSpan;
    let step;
    if (span > 3000) step = 500;
    else if (span > 1500) step = 250;
    else if (span > 600) step = 100;
    else if (span > 250) step = 50;
    else if (span > 100) step = 25;
    else step = 10;
    const start = Math.ceil(viewStart / step) * step;
    const out = [];
    for (let y = start; y <= viewEnd; y += step) out.push(y);
    return out;
  }, [viewStart, viewEnd, visSpan]);

  const selectedItem = useMemo(
    () => TIMELINE_DATA.find(d => `${d.label}-${d.year}` === selectedKey),
    [selectedKey]
  );

  // Story↔Written visualization: triggers when a selected item has storyStart
  const soloBook = useMemo(() => {
    if (!selectedItem || selectedItem.storyStart == null) return null;
    return selectedItem;
  }, [selectedItem]);

  // Auto-zoom when solo view is toggled on for a book with story span
  const prevSoloViewRef = useRef(false);
  useEffect(() => {
    if (soloView && soloBook && !prevSoloViewRef.current) {
      const minY = Math.min(soloBook.storyStart, soloBook.year);
      const maxY = Math.max(soloBook.storyEnd, soloBook.endYear || soloBook.year);
      const pad = Math.max((maxY - minY) * 0.15, 50);
      animateView(
        Math.max(MIN_YR, minY - pad),
        Math.min(MAX_YR, maxY + pad),
        600
      );
    }
    prevSoloViewRef.current = soloView;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [soloView, soloBook]);

  const navigateStep = useCallback((dir) => {
    const idx = data.findIndex(d => `${d.label}-${d.year}` === selectedKey);
    const next = idx === -1
      ? (dir > 0 ? data[0] : data[data.length - 1])
      : data[clamp(idx + dir, 0, data.length - 1)];
    if (next) {
      setSelectedKey(`${next.label}-${next.year}`);
      ensureVisible(next.year);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, selectedKey, visSpan, viewStart, viewEnd]);

  const svgHeight = effMainH;

  return (
    <div className="bt-root">
      {/* ─── HEADER ─── */}
      <header className="bt-header">
        <div className="bt-brand">
          <button className="bt-mark" onClick={() => setInfoOpen(true)} aria-label="About & Help" title="About & How to Use">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2 L12 22 M4 6 L20 6 M5 12 L19 12 M6 18 L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <div>
            <div className="bt-brand-name">Canon <span className="bt-amp">&amp;</span> Chronicle</div>
            <div className="bt-brand-sub">The Making of the Bible · 2000 BCE — 1947 CE</div>
          </div>
        </div>
        <div className="bt-header-right">
          <span className="bt-header-count">
            <b>{data.length}</b> of {TIMELINE_DATA.length}
          </span>
          <button
            className={`bt-filter-toggle ${filterPanelOpen ? "open" : ""} ${!isDefaultFilters ? "active" : ""}`}
            onClick={() => setFilterPanelOpen(p => !p)}
            aria-expanded={filterPanelOpen}
            aria-label="Toggle filter panel"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 4 L14 4 M4 8 L12 8 M6 12 L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Filters
            {!isDefaultFilters && <span className="bt-filter-badge" />}
          </button>
        </div>
      </header>

      {/* ─── FILTER PANEL ─── */}
      {filterPanelOpen && (
        <FilterPanel
          activeSubs={activeSubs}
          activeTraditions={activeTraditions}
          onToggleSub={toggleSub}
          onSoloSub={soloSub}
          onSetGroup={setGroupSubs}
          onToggleTradition={toggleTradition}
          onReset={resetFilters}
          onClose={() => setFilterPanelOpen(false)}
          isDefault={isDefaultFilters}
          totalCount={TIMELINE_DATA.length}
          visibleCount={data.length}
        />
      )}

      {/* ─── MAIN TIMELINE ─── */}
      <div className="bt-main" ref={wrapRef}>
        <div className="bt-grid-bg" />
        <div
          className="bt-scroll"
          ref={scrollRef}
          onScroll={onMainScroll}
          tabIndex={0}
          aria-label="Timeline. Use arrow keys to navigate events, plus and minus to zoom."
        >
          <svg width={svgWidth} height={svgHeight} className="bt-svg">
            <defs>
              {Object.entries(TYPE_CONFIG).map(([t, c]) => (
                <filter key={t} id={`glow-${t}`} x="-200%" y="-200%" width="500%" height="500%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feFlood floodColor={c.ink} floodOpacity="0.55" />
                  <feComposite in2="blur" operator="in" />
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              ))}
            </defs>

            {/* Era gridlines */}
            {eras.map(yr => {
              const x = yearToSvgX(yr);
              return (
                <g key={yr}>
                  <line x1={x} y1={40} x2={x} y2={svgHeight - 42} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                  <text x={x} y={svgHeight - 16} textAnchor="middle" className="bt-era">{fmtYr(yr)}</text>
                </g>
              );
            })}

            {/* Central axis */}
            <line x1={0} y1={AXIS_Y} x2={svgWidth} y2={AXIS_Y} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

            {/* ─── Solo-book story↔written visualization ─── */}
            {soloBook && (() => {
              const cfg = TYPE_CONFIG[soloBook.type];
              const storyX1 = yearToSvgX(soloBook.storyStart);
              const storyX2 = yearToSvgX(soloBook.storyEnd);
              const writtenX1 = yearToSvgX(soloBook.year);
              const writtenX2 = soloBook.endYear ? yearToSvgX(soloBook.endYear) : writtenX1;
              const storyW = Math.max(4, storyX2 - storyX1);
              const writtenW = Math.max(4, writtenX2 - writtenX1);
              // Dotted connector from story end to written start
              const connStart = Math.min(storyX2, writtenX1);
              const connEnd = Math.max(storyX2, writtenX1);
              const labelAbove = AXIS_Y - 28;
              const labelBelow = AXIS_Y + 22;

              return (
                <g className="bt-solo-book">
                  {/* Story period — thick glowing bar above axis */}
                  <rect
                    x={storyX1} y={AXIS_Y - 6}
                    width={storyW} height={12} rx={3}
                    fill={cfg.ink} opacity="0.35"
                  />
                  <rect
                    x={storyX1} y={AXIS_Y - 4}
                    width={storyW} height={8} rx={2}
                    fill={cfg.ink} opacity="0.65"
                  />
                  {/* Story period glow */}
                  <rect
                    x={storyX1 - 2} y={AXIS_Y - 10}
                    width={storyW + 4} height={20} rx={4}
                    fill={cfg.ink} opacity="0.08"
                    filter={`url(#glow-${soloBook.type})`}
                  />
                  {/* Story label */}
                  <text x={(storyX1 + storyX2) / 2} y={labelAbove} textAnchor="middle"
                    className="bt-solo-label">
                    Story period: {fmtYr(soloBook.storyStart)} — {fmtYr(soloBook.storyEnd)}
                  </text>

                  {/* Dotted connector between story and written */}
                  {Math.abs(connEnd - connStart) > 8 && (
                    <line
                      x1={connStart + 2} y1={AXIS_Y}
                      x2={connEnd - 2} y2={AXIS_Y}
                      stroke={cfg.ink}
                      strokeWidth="2"
                      strokeDasharray="6 4"
                      opacity="0.4"
                      className="bt-solo-connector"
                    />
                  )}

                  {/* Written period — bar below axis */}
                  <rect
                    x={writtenX1} y={AXIS_Y - 4}
                    width={writtenW} height={8} rx={2}
                    fill="#fff" opacity="0.5"
                  />
                  <rect
                    x={writtenX1} y={AXIS_Y - 3}
                    width={writtenW} height={6} rx={1.5}
                    fill={cfg.ink} opacity="0.9"
                  />
                  {/* Written label */}
                  <text x={(writtenX1 + writtenX2) / 2} y={labelBelow} textAnchor="middle"
                    className="bt-solo-label bt-solo-label-written">
                    Written: {fmtYr(soloBook.year)}{soloBook.endYear ? ` — ${fmtYr(soloBook.endYear)}` : ""}
                  </text>

                  {/* End markers */}
                  <circle cx={storyX1} cy={AXIS_Y} r={4} fill={cfg.ink} opacity="0.7" />
                  <circle cx={storyX2} cy={AXIS_Y} r={4} fill={cfg.ink} opacity="0.7" />
                  <circle cx={writtenX1} cy={AXIS_Y} r={3.5} fill="#fff" stroke={cfg.ink} strokeWidth="1.5" />
                  {soloBook.endYear && (
                    <circle cx={writtenX2} cy={AXIS_Y} r={3.5} fill="#fff" stroke={cfg.ink} strokeWidth="1.5" />
                  )}
                </g>
              );
            })()}

            {renderEntries.map(entry => {
              const off = SLOT_OFFSETS[entry.slot];
              const labelY = AXIS_Y + off;
              const ax = entry.anchorX;
              // year text closer to axis; label text further from axis
              const yearY = labelY + (off < 0 ? 19 : -19);
              const textY = labelY;
              const isHov = entry.groupKey === hoveredKey;

              /* Render as single marker */
              if (entry.visibleCount === 1) {
                const item = entry.visible[0];
                const cfg = TYPE_CONFIG[item.type];
                const isSel = item.key === selectedKey;
                const isPin = entry.isPinned;
                const hasRange = item.endYear && Math.abs(item.endYear - item.year) > 1;
                const rangeEndX = hasRange ? yearToSvgX(item.endYear) : ax;
                const labelText = item.label.length > 30 ? item.label.slice(0, 28) + "…" : item.label;
                const labelTextW = Math.min(labelText.length * 6.6, 200);

                return (
                  <g
                    key={entry.groupKey}
                    className={`bt-event ${isSel ? "sel" : ""} ${isPin ? "pin" : ""} ${isHov ? "hov" : ""}`}
                    onClick={(e) => { e.stopPropagation(); setSelectedKey(isSel ? null : item.key); }}
                    onMouseEnter={(e) => {
                      setHoveredKey(entry.groupKey);
                      setHover({
                        kind: "single",
                        x: e.clientX,
                        y: e.clientY,
                        label: item.label,
                        meta: fmtYr(item.year) + (item.endYear ? ` – ${fmtYr(item.endYear)}` : ""),
                        color: cfg.ink,
                      });
                    }}
                    onMouseMove={(e) => setHover(h => h && { ...h, x: e.clientX })}
                    onMouseLeave={() => { setHoveredKey(null); setHover(null); }}
                  >
                    {/* Column of light for pinned events — spans full timeline height */}
                    {isPin && (
                      <>
                        <line
                          x1={ax} y1={28} x2={ax} y2={svgHeight - 44}
                          stroke={cfg.ink} strokeWidth="1" opacity="0.18"
                        />
                        <line
                          x1={ax} y1={28} x2={ax} y2={svgHeight - 44}
                          stroke={cfg.ink} strokeWidth="3" opacity="0.06"
                        />
                      </>
                    )}
                    {hasRange && (
                      <line
                        x1={ax} y1={AXIS_Y} x2={rangeEndX} y2={AXIS_Y}
                        stroke={cfg.ink} strokeWidth={isSel ? 5 : (isPin ? 4 : 3.5)} strokeLinecap="round" opacity={isPin ? 0.55 : 0.45}
                      />
                    )}
                    <line
                      x1={ax} y1={AXIS_Y}
                      x2={ax} y2={labelY + (off < 0 ? 10 : -10)}
                      stroke={isSel || isPin ? cfg.ink : "rgba(255,255,255,0.15)"}
                      strokeWidth={isSel ? 1.5 : (isPin ? 1.2 : 1)}
                      opacity={isPin ? 0.6 : 1}
                    />
                    <g transform={`translate(${ax} ${AXIS_Y})`}>
                      <g className="bt-marker-scale">
                        {isPin && !isSel && (
                          <>
                            <circle r={14} fill={cfg.ink} opacity="0.12" filter={`url(#glow-${item.type})`} />
                            <circle r={9} fill="none" stroke={cfg.ink} strokeWidth="1" opacity="0.35" />
                          </>
                        )}
                        <circle r={isSel ? 9 : (isPin ? 10 : 7)} fill={cfg.ink} opacity={isSel ? 0.3 : (isPin ? 0.22 : 0.18)} filter={`url(#glow-${item.type})`} />
                        <circle r={isSel ? 5 : (isPin ? 4.8 : 3.8)} fill={cfg.ink} stroke="#0A0A0B" strokeWidth={1.5} />
                        {isSel && <circle r={11} fill="none" stroke={cfg.ink} strokeWidth="1" opacity="0.55" />}
                      </g>
                    </g>
                    <rect x={ax - 22} y={AXIS_Y - 22} width={44} height={44} fill="transparent" style={{ cursor: "pointer" }} />
                    {/* Both backgrounds first (painter's order) */}
                    <rect
                      className="bt-label-bg"
                      x={ax - labelTextW / 2 - 6} y={textY - 9}
                      width={labelTextW + 12} height={17} rx={3}
                    />
                    <rect
                      className="bt-label-bg"
                      x={ax - 30} y={yearY - 7}
                      width={60} height={13} rx={2}
                    />
                    {/* Then text on top of both backgrounds */}
                    <text x={ax} y={yearY} textAnchor="middle" className={`bt-year ${isPin ? "pin" : ""}`} fill={cfg.ink}>
                      {fmtYr(item.year)}
                    </text>
                    <text x={ax} y={textY} textAnchor="middle" dominantBaseline="middle"
                      className={`bt-label ${isSel ? "sel" : ""} ${isPin ? "pin" : ""}`}>
                      {labelText}
                    </text>
                  </g>
                );
              }

              /* Render as cluster pill */
              const types = Array.from(new Set(entry.visible.map(i => i.type)));
              const dominant = TYPE_CONFIG[types[0]].ink;
              const hasSelected = entry.visible.some(i => i.key === selectedKey);

              const years = entry.visible.map(i => i.year).sort((a, b) => a - b);
              const startYearSpan = years[years.length - 1] - years[0];
              // Check if zoom would actually separate items: estimate px/yr at target zoom
              // Target view span = yearSpan * 1.4 (pad), need each pair > CLUSTER_DIST px apart
              const targetSpan = Math.max(startYearSpan * 1.8, MIN_VIS_SPAN);
              const targetPxPerYr = (wrapW - 2 * EDGE_PAD) / targetSpan;
              // Find minimum gap between consecutive years
              const sortedUnique = [...new Set(years)].sort((a, b) => a - b);
              const minGap = sortedUnique.length > 1
                ? Math.min(...sortedUnique.slice(1).map((y, i) => y - sortedUnique[i]))
                : 0;
              const canResolveByZoom = startYearSpan >= 5 && minGap * targetPxPerYr > CLUSTER_DIST * 1.5;

              return (
                <g
                  key={entry.groupKey}
                  className={`bt-cluster ${hasSelected ? "sel" : ""} ${isHov ? "hov" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (canResolveByZoom) {
                      zoomToRange(entry.minYr, entry.maxYr);
                    } else {
                      // Can't resolve by zooming — show popover menu
                      setClusterMenu({
                        x: e.clientX,
                        y: e.clientY,
                        items: entry.visible,
                        minYr: entry.minYr,
                        maxYr: entry.maxYr,
                      });
                    }
                  }}
                  onMouseEnter={(e) => {
                    setHoveredKey(entry.groupKey);
                    setHover({
                      kind: "cluster",
                      x: e.clientX,
                      y: e.clientY,
                      label: `${entry.visibleCount} events`,
                      meta: `${fmtYr(entry.minYr)} — ${fmtYr(entry.maxYr)} · ${canResolveByZoom ? "click to expand" : "click to open"}`,
                      color: dominant,
                      items: entry.visible.slice(0, 6),
                    });
                  }}
                  onMouseMove={(e) => setHover(h => h && { ...h, x: e.clientX })}
                  onMouseLeave={() => { setHoveredKey(null); setHover(null); }}
                >
                  <line
                    x1={ax} y1={AXIS_Y}
                    x2={ax} y2={labelY + (off < 0 ? 14 : -14)}
                    stroke="rgba(255,255,255,0.18)" strokeWidth={1}
                  />
                  <g transform={`translate(${ax} ${AXIS_Y})`}>
                    <circle r={5} fill={dominant} opacity="0.2" />
                    <circle r={2.5} fill={dominant} stroke="#0A0A0B" strokeWidth={1.2} />
                  </g>
                  <g transform={`translate(${ax} ${labelY})`}>
                    <rect x={-20} y={-12} width={40} height={24} rx={12}
                      fill="#15151A" stroke={dominant} strokeWidth={1.3} />
                    <rect x={-20} y={-12} width={40} height={24} rx={12}
                      fill={dominant} opacity="0.09" />
                    <text x={0} y={4} textAnchor="middle" className="bt-cluster-num">
                      {entry.visibleCount}
                    </text>
                    {types.slice(0, 5).map((t, ti, arr) => (
                      <circle
                        key={t}
                        cx={-(arr.length - 1) * 3 + ti * 6}
                        cy={off < 0 ? -18 : 18}
                        r={1.8}
                        fill={TYPE_CONFIG[t].ink}
                      />
                    ))}
                  </g>
                  <rect x={ax - 24} y={labelY - 14} width={48} height={28} fill="transparent" style={{ cursor: "pointer" }} />
                </g>
              );
            })}
          </svg>
        </div>

        {visibleEntries.length === 0 && (
          <div className="bt-empty">
            <div>No events in this window</div>
            <button className="bt-btn" onClick={resetView}>Reset view</button>
          </div>
        )}
      </div>

      {selectedItem && (
        <Reader
          item={selectedItem}
          items={data}
          onPrev={() => { setSoloView(false); navigateStep(-1); }}
          onNext={() => { setSoloView(false); navigateStep(1); }}
          onClose={() => { setSelectedKey(null); setSoloView(false); }}
          onSelectRelated={(label) => {
            setSoloView(false);
            const target = TIMELINE_DATA.find(d => d.label === label);
            if (target) {
              setSelectedKey(`${target.label}-${target.year}`);
              ensureVisible(target.year);
            }
          }}
          onTermClick={(term, display, e) => {
            setGlossaryPopover({ term, display, x: e.clientX, y: e.clientY });
          }}
          soloView={soloView}
          onToggleSoloView={() => setSoloView(p => !p)}
        />
      )}

      {/* ─── NAVIGATOR ─── */}
      <Navigator
        data={data}
        filters={null}
        viewStart={viewStart}
        viewEnd={viewEnd}
        setView={(s, e) => { cancelAnim(); setViewStart(s); setViewEnd(e); }}
        onReset={resetView}
        onZoomIn={() => zoomBy(0.65)}
        onZoomOut={() => zoomBy(1.55)}
      />

      {hover && !clusterMenu && <HoverTip hover={hover} />}

      {clusterMenu && (
        <ClusterMenu
          menu={clusterMenu}
          onSelect={(item) => {
            setSelectedKey(`${item.label}-${item.year}`);
            setClusterMenu(null);
          }}
          onClose={() => setClusterMenu(null)}
        />
      )}

      {glossaryPopover && (
        <GlossaryPopover
          popover={glossaryPopover}
          onNavigate={(term) => setGlossaryPopover(p => p && { ...p, term, display: term })}
          onClose={() => setGlossaryPopover(null)}
        />
      )}

      {infoOpen && <InfoOverlay onClose={() => setInfoOpen(false)} />}

      <Styles />
    </div>
  );
}

/* ═══════════════ NAVIGATOR ═══════════════ */
function Navigator({ data, filters, viewStart, viewEnd, setView, onReset, onZoomIn, onZoomOut }) {
  const trackWrapRef = useRef(null);
  const trackRef = useRef(null);
  const [w, setW] = useState(() =>
    typeof window !== "undefined" ? Math.max(400, window.innerWidth - 56) : 1000
  );

  useLayoutEffect(() => {
    const el = trackWrapRef.current;
    if (!el) return;
    const update = () => setW(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const H = 56;
  const HANDLE_HALF = 4;                          // handle half-width
  const TRACK_PAD = HANDLE_HALF + 1;              // leave room for handles at both ends
  const trackW = Math.max(100, w - 2 * TRACK_PAD);

  const yearToX = (y) => TRACK_PAD + ((y - MIN_YR) / SPAN) * trackW;
  const xToYear = (x) => MIN_YR + ((x - TRACK_PAD) / trackW) * SPAN;

  const rawWinX = yearToX(viewStart);
  const rawWinR = yearToX(viewEnd);
  // Clamp the drawable handle positions so they can't overshoot the track
  const winX = clamp(rawWinX, TRACK_PAD, TRACK_PAD + trackW - HANDLE_HALF);
  const winR = clamp(rawWinR, TRACK_PAD + HANDLE_HALF, TRACK_PAD + trackW);
  const winW = Math.max(22, winR - winX);

  const visibleData = useMemo(
    () => data,
    [data]
  );

  const dragMode = useRef(null);
  const dragStart = useRef({ x: 0, vs: 0, ve: 0 });

  const pointerToTrackX = (e) => {
    const rect = trackRef.current.getBoundingClientRect();
    return e.clientX - rect.left;
  };

  const onPointerDown = (mode) => (e) => {
    e.preventDefault(); e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragMode.current = mode;
    dragStart.current = { x: pointerToTrackX(e), vs: viewStart, ve: viewEnd };
  };
  const onPointerMove = (e) => {
    if (!dragMode.current) return;
    const x = pointerToTrackX(e);
    const dx = x - dragStart.current.x;
    const dYear = (dx / trackW) * SPAN;
    const { vs, ve } = dragStart.current;
    if (dragMode.current === "pan") {
      let ns = vs + dYear, ne = ve + dYear;
      if (ns < MIN_YR) { ne += (MIN_YR - ns); ns = MIN_YR; }
      if (ne > MAX_YR) { ns -= (ne - MAX_YR); ne = MAX_YR; }
      setView(ns, ne);
    } else if (dragMode.current === "left") {
      const ns = clamp(vs + dYear, MIN_YR, ve - MIN_VIS_SPAN);
      setView(ns, ve);
    } else if (dragMode.current === "right") {
      const ne = clamp(ve + dYear, vs + MIN_VIS_SPAN, MAX_YR);
      setView(vs, ne);
    }
  };
  const onPointerUp = (e) => {
    if (!dragMode.current) return;
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {}
    dragMode.current = null;
  };

  const onTrackClick = (e) => {
    if (dragMode.current) return;
    const x = pointerToTrackX(e);
    if (x >= winX && x <= winR) return;
    const yr = xToYear(x);
    const half = (viewEnd - viewStart) / 2;
    let ns = clamp(yr - half, MIN_YR, MAX_YR - (viewEnd - viewStart));
    setView(ns, ns + (viewEnd - viewStart));
  };

  const typeRows = { "event": 0, "writing-ot": 1, "writing-nt": 2, "writing-noncanon": 3, "canon": 4 };
  const ROW_H = (H - 10) / 5;

  return (
    <div className="bt-nav-host">
      <div className="bt-nav-meta">
        <span className="bt-nav-range">
          <span className="bt-nav-range-val">{fmtYr(viewStart)}</span>
          <span className="bt-nav-range-arrow">
            <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
              <path d="M1 5 L18 5 M14 1 L18 5 L14 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="bt-nav-range-val">{fmtYr(viewEnd)}</span>
        </span>
        <span className="bt-nav-dot" />
        <span className="bt-nav-span">
          <b>{Math.round(viewEnd - viewStart).toLocaleString()}</b>
          <span className="bt-nav-unit">yrs</span>
          <span className="bt-nav-pct">{Math.round(((viewEnd - viewStart) / SPAN) * 100)}%</span>
        </span>
        <div className="bt-nav-tools">
          <button className="bt-btn-icon" onClick={onZoomOut} title="Zoom out (−)" aria-label="Zoom out">
            <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 6 L10 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
          </button>
          <button className="bt-btn-icon" onClick={onZoomIn} title="Zoom in (+)" aria-label="Zoom in">
            <svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 2 L6 10 M2 6 L10 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
          </button>
          <button className="bt-btn-icon" onClick={onReset} title="Reset (0)" aria-label="Reset view">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6 A4 4 0 1 1 6 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M2 3 L2 6 L5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="bt-nav-track-wrap" ref={trackWrapRef}>
      <svg ref={trackRef} width={w} height={H} className="bt-nav-svg" onClick={onTrackClick} onDoubleClick={onReset}>
        {/* Track background */}
        <rect x={TRACK_PAD} y={5} width={trackW} height={H - 10} rx={6}
          fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

        {/* Era grid */}
        {[-4000, -3000, -2000, -1500, -1000, -500, 0, 500, 1000, 1500, 2000].map(yr => {
          const x = yearToX(yr);
          return (
            <g key={yr} pointerEvents="none">
              <line x1={x} y1={5} x2={x} y2={H - 5} stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
              <text x={x} y={H - 9} textAnchor="middle" className="bt-nav-era">
                {yr === 0 ? "0" : (yr < 0 ? `${Math.abs(yr / 1000)}k` : yr)}
              </text>
            </g>
          );
        })}

        {/* Density ticks */}
        {visibleData.map((d, i) => {
          const cfg = TYPE_CONFIG[d.type];
          const x = yearToX(d.year);
          const row = typeRows[d.type];
          const y = 7 + row * ROW_H;
          return (
            <rect
              key={i}
              x={x - 0.9} y={y}
              width={1.8} height={ROW_H - 1.5}
              fill={cfg.ink}
              opacity="0.75"
              pointerEvents="none"
            />
          );
        })}

        {/* Dim veil */}
        <rect x={TRACK_PAD} y={5} width={Math.max(0, winX - TRACK_PAD)} height={H - 10}
          rx={6} fill="#000" fillOpacity="0.55" pointerEvents="none" />
        <rect x={winR} y={5} width={Math.max(0, (TRACK_PAD + trackW) - winR)} height={H - 10}
          rx={6} fill="#000" fillOpacity="0.55" pointerEvents="none" />

        {/* Window body */}
        <rect
          x={winX} y={5}
          width={winW} height={H - 10}
          rx={4}
          fill="rgba(245, 165, 36, 0.04)"
          stroke="#F5A524"
          strokeWidth="1.5"
          style={{ cursor: "grab", filter: "drop-shadow(0 0 8px rgba(245,165,36,0.35))" }}
          onPointerDown={onPointerDown("pan")}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />

        {/* Left handle */}
        <g onPointerDown={onPointerDown("left")} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} style={{ cursor: "ew-resize" }}>
          <rect x={winX - 6} y={5} width={12} height={H - 10} fill="transparent" />
          <rect x={winX - 3} y={12} width={6} height={H - 24} rx={3} fill="#F5A524" />
          <line x1={winX - 0.6} y1={16} x2={winX - 0.6} y2={H - 16} stroke="#0A0A0B" strokeWidth="0.7" />
          <line x1={winX + 0.6} y1={16} x2={winX + 0.6} y2={H - 16} stroke="#0A0A0B" strokeWidth="0.7" />
        </g>

        {/* Right handle */}
        <g onPointerDown={onPointerDown("right")} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} style={{ cursor: "ew-resize" }}>
          <rect x={winR - 6} y={5} width={12} height={H - 10} fill="transparent" />
          <rect x={winR - 3} y={12} width={6} height={H - 24} rx={3} fill="#F5A524" />
          <line x1={winR - 0.6} y1={16} x2={winR - 0.6} y2={H - 16} stroke="#0A0A0B" strokeWidth="0.7" />
          <line x1={winR + 0.6} y1={16} x2={winR + 0.6} y2={H - 16} stroke="#0A0A0B" strokeWidth="0.7" />
        </g>
      </svg>
      </div>

      <div className="bt-nav-hint">
        <kbd>drag</kbd> pan · <kbd>handles</kbd> resize · <kbd>click</kbd> jump · <kbd>⌘</kbd>+<kbd>wheel</kbd> zoom timeline
      </div>
    </div>
  );
}

/* ═══════════════ INFO OVERLAY (How-to + About) ═══════════════ */
function InfoOverlay({ onClose }) {
  const [tab, setTab] = useState("howto");

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="bt-info-overlay">
      <div className="bt-info-backdrop" onClick={onClose} />
      <div className="bt-info-card" role="dialog" aria-label="About Canon & Chronicle">
        <div className="bt-info-header">
          <div className="bt-info-tabs">
            <button className={`bt-info-tab ${tab === "howto" ? "active" : ""}`} onClick={() => setTab("howto")}>How to Use</button>
            <button className={`bt-info-tab ${tab === "about" ? "active" : ""}`} onClick={() => setTab("about")}>About</button>
          </div>
          <button className="bt-close" onClick={onClose} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 14 14">
              <path d="M3 3 L11 11 M11 3 L3 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="bt-info-body">
          {tab === "howto" ? (
            <div className="bt-info-howto">
              <div className="bt-info-section">
                <div className="bt-info-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M2 10 L18 10 M6 6 L6 14 M14 6 L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </div>
                <div>
                  <h3>Timeline</h3>
                  <p>Scroll horizontally to pan through history. Pinch or use <kbd>Cmd</kbd>+<kbd>scroll</kbd> to zoom in and out. The vertical columns of light mark key milestone events — these stay visible at every zoom level to orient you.</p>
                </div>
              </div>

              <div className="bt-info-section">
                <div className="bt-info-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="7" width="16" height="6" rx="2" stroke="currentColor" strokeWidth="1.5"/><rect x="6" y="8" width="5" height="4" rx="1" fill="currentColor" opacity="0.4"/></svg>
                </div>
                <div>
                  <h3>Navigator</h3>
                  <p>The minimap at the bottom shows where you are in the full 4,000-year span. Drag the highlighted window to pan. Drag either handle to expand or contract your view. Click anywhere on the track to jump. The colored ticks show event density.</p>
                </div>
              </div>

              <div className="bt-info-section">
                <div className="bt-info-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M2 5 L18 5 M4 10 L16 10 M6 15 L14 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </div>
                <div>
                  <h3>Filters</h3>
                  <p>Click <b>Filters</b> in the top-right to open the category panel. Toggle subcategories on or off. Use the target icon <b>(&#x2299;)</b> to solo a single category. The <b>Canon Traditions</b> row at the bottom filters books by Jewish, Protestant, Catholic, or Orthodox inclusion. Use <b>All / None</b> to control entire groups at once.</p>
                </div>
              </div>

              <div className="bt-info-section">
                <div className="bt-info-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="12" width="16" height="6" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M5 15 L15 15" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/><path d="M3 8 L10 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </div>
                <div>
                  <h3>Reader</h3>
                  <p>Click any event or book marker to open the reader panel at the bottom. Use the <b>Prev/Next</b> arrows to step through events. For books with narrative spans, the <b>Solo view</b> button isolates that book and shows its story period versus when it was written. Each entry includes scholarly context, quotes, sources, and cross-references.</p>
                </div>
              </div>

              <div className="bt-info-section">
                <div className="bt-info-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 16 C4 16 6 8 10 8 C14 8 16 16 16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="10" cy="5" r="2" stroke="currentColor" strokeWidth="1.5"/></svg>
                </div>
                <div>
                  <h3>Glossary</h3>
                  <p>Scholarly terms in the reader text appear with a <span style={{borderBottom: "1px dotted #F5A524", color: "#F5A524"}}>dotted underline</span>. Click any term to see its definition in a popover — and navigate between related terms without leaving the reader. About 30 terms are covered, from "Documentary Hypothesis" to "homoousios."</p>
                </div>
              </div>

              <div className="bt-info-section">
                <div className="bt-info-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="5" y="6" width="10" height="8" rx="4" stroke="currentColor" strokeWidth="1.5"/><text x="10" y="12" textAnchor="middle" fontSize="7" fontWeight="700" fill="currentColor">5</text></svg>
                </div>
                <div>
                  <h3>Clusters</h3>
                  <p>When events are too close together, they collapse into numbered pills showing the count. Click a cluster to zoom in and separate them — or, if the events share the same date, a selection menu will open so you can pick the one you want. Hover any cluster to preview its contents.</p>
                </div>
              </div>

              <div className="bt-info-section">
                <div className="bt-info-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.5"/><path d="M7 10 L9 12 L13 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div>
                  <h3>Keyboard Shortcuts</h3>
                  <p><kbd>+</kbd> / <kbd>-</kbd> zoom in/out &middot; <kbd>0</kbd> reset view &middot; <kbd>&larr;</kbd> / <kbd>&rarr;</kbd> step between events &middot; <kbd>Esc</kbd> close panels</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bt-info-about">
              <div className="bt-info-about-hero">
                <div className="bt-info-about-mark">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2 L12 22 M4 6 L20 6 M5 12 L19 12 M6 18 L18 18" stroke="#F5A524" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <h2 className="bt-info-about-title">Canon <span className="bt-amp">&amp;</span> Chronicle</h2>
                  <p className="bt-info-about-tagline">An interactive timeline of how the Bible was formed</p>
                </div>
              </div>

              <div className="bt-info-about-section">
                <h3>What this is</h3>
                <p>Canon & Chronicle is a factual, research-driven overview of how the Bible came together over four thousand years — from the earliest oral traditions through the Dead Sea Scrolls discovery in 1947. It presents historical events, scholarly consensus, and documented disputes without advocating for any particular theological position.</p>
                <p>Traditional and critical perspectives are shown side by side — who tradition says wrote each book, what modern scholarship concludes, and where they agree or disagree — so readers can explore the evidence and form their own understanding.</p>
              </div>

              <div className="bt-info-about-section">
                <h3>What this is not</h3>
                <p>This is not a devotional tool, a theological argument, or a statement of faith. It does not attempt to prove or disprove any religious claim. The goal is simply to make the complex history of biblical formation accessible to anyone curious about it — believer, skeptic, or scholar.</p>
              </div>

              <div className="bt-info-about-section">
                <h3>Sources</h3>
                <p>The timeline draws on a range of primary texts, academic references, and historical scholarship, including:</p>
                <ul>
                  <li>Biblical texts (Hebrew Bible, Septuagint, New Testament, deuterocanonical books)</li>
                  <li>Ancient sources (Josephus, Tacitus, Eusebius, Athanasius, Jerome, Augustine)</li>
                  <li>Modern scholarship (Wellhausen, Friedman, Ehrman, Metzger, Finkelstein, Brown, Collins, and others cited per entry)</li>
                  <li>Archaeological evidence (Dead Sea Scrolls, Nag Hammadi, Tel Dan Stele, Cyrus Cylinder)</li>
                </ul>
                <p>Individual entries cite their specific sources in the reader panel.</p>
              </div>

              <div className="bt-info-about-section">
                <h3>Contact</h3>
                <p>Questions, corrections, or suggestions:<br/>
                <a href="mailto:hello@canonandchronicle.com" className="bt-info-email">hello@canonandchronicle.com</a></p>
              </div>

              <div className="bt-info-about-footer">
                <p>Built with <a href="https://claude.ai" target="_blank" rel="noopener noreferrer">Claude</a> &middot; <a href="https://github.com/glutenallergy/canon-and-chronicle" target="_blank" rel="noopener noreferrer">Source on GitHub</a></p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ FILTER PANEL ═══════════════ */
function FilterPanel({ activeSubs, activeTraditions, onToggleSub, onSoloSub, onSetGroup, onToggleTradition, onReset, onClose, isDefault, totalCount, visibleCount }) {
  const [collapsed, setCollapsed] = useState({});
  const toggleCollapse = (key) => setCollapsed(p => ({ ...p, [key]: !p[key] }));

  return (
    <div className="bt-fp" role="region" aria-label="Filters">
      <div className="bt-fp-head">
        <span className="bt-fp-title">Filters</span>
        <span className="bt-fp-summary">
          Showing <b>{visibleCount}</b> of {totalCount}
        </span>
        {!isDefault && (
          <button className="bt-fp-reset" onClick={onReset}>Reset all</button>
        )}
        <button className="bt-fp-close" onClick={onClose} aria-label="Close filters">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path d="M3 3 L11 11 M11 3 L3 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="bt-fp-body">
        {Object.entries(CATEGORIES).map(([catKey, cat]) => {
          const subs = Object.entries(cat.subcategories);
          const allOn = subs.every(([k]) => activeSubs.has(k));
          const noneOn = subs.every(([k]) => !activeSubs.has(k));
          const isCollapsed = collapsed[catKey];

          // Count visible items per subcategory
          const subCounts = {};
          subs.forEach(([k]) => {
            subCounts[k] = TIMELINE_DATA.filter(d => d.subcategory === k).length;
          });

          return (
            <div key={catKey} className="bt-fp-group">
              <div className="bt-fp-group-head">
                <button
                  className="bt-fp-group-toggle"
                  onClick={() => toggleCollapse(catKey)}
                  aria-expanded={!isCollapsed}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
                    className={`bt-fp-chevron ${isCollapsed ? "" : "open"}`}>
                    <path d="M3 2 L7 5 L3 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span style={{ color: cat.color }}>{cat.label}</span>
                </button>
                <div className="bt-fp-group-actions">
                  <button
                    className={`bt-fp-bulk ${allOn ? "active" : ""}`}
                    onClick={() => {
                      setCollapsed(p => ({ ...p, [catKey]: false }));
                      onSetGroup(catKey, "all");
                    }}
                  >All</button>
                  <button
                    className={`bt-fp-bulk ${noneOn ? "active" : ""}`}
                    onClick={() => onSetGroup(catKey, "none")}
                  >None</button>
                </div>
              </div>

              {!isCollapsed && (
                <div className="bt-fp-chips">
                  {subs.map(([subKey, sub]) => {
                    const on = activeSubs.has(subKey);
                    const isSoloed = on && activeSubs.size === 1;
                    const count = subCounts[subKey];
                    return (
                      <div
                        key={subKey}
                        className={`bt-fp-chip ${on ? "on" : ""} ${isSoloed ? "solo" : ""}`}
                        style={on ? { "--fpc": cat.color } : undefined}
                      >
                        <button
                          className="bt-fp-chip-btn"
                          onClick={() => onToggleSub(subKey)}
                          aria-pressed={on}
                        >
                          <span className="bt-fp-chip-dot" style={on ? { background: cat.color, boxShadow: `0 0 8px ${cat.color}` } : undefined} />
                          {sub.label}
                          <span className="bt-fp-chip-count">{count}</span>
                        </button>
                        <button
                          className="bt-fp-chip-solo"
                          onClick={() => isSoloed ? onReset() : onSoloSub(subKey)}
                          title={isSoloed ? "Show all" : `Show only ${sub.label}`}
                          aria-label={isSoloed ? "Show all" : `Show only ${sub.label}`}
                        >
                          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                            <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.3" />
                            <circle cx="6" cy="6" r="1.3" fill="currentColor" />
                          </svg>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Tradition cross-filter */}
        <div className="bt-fp-group">
          <div className="bt-fp-group-head">
            <span className="bt-fp-tradition-label">Canon Traditions</span>
          </div>
          <div className="bt-fp-chips">
            {Object.entries(CANON_LABELS).map(([key, label]) => {
              const on = activeTraditions.has(key);
              return (
                <button
                  key={key}
                  className={`bt-fp-tradition ${on ? "on" : ""}`}
                  onClick={() => onToggleTradition(key)}
                  aria-pressed={on}
                >
                  <span className={`bt-canon-badge bt-canon-${key}`} style={{ marginRight: 6 }}>{label}</span>
                  {on ? "On" : "Off"}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ CLUSTER MENU (popover for same-year clusters) ═══════════════ */
function ClusterMenu({ menu, onSelect, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Clamp position + flip below if not enough room above
  const estMenuH = Math.min(menu.items.length * 52 + 60, 420);
  const clampedX = typeof window !== "undefined"
    ? clamp(menu.x, 180, window.innerWidth - 180)
    : menu.x;
  const flip = typeof window !== "undefined" && menu.y < estMenuH + 20;
  const clampedY = typeof window !== "undefined"
    ? clamp(menu.y, 20, window.innerHeight - 40)
    : menu.y;

  return (
    <>
      <div className="bt-cluster-menu-backdrop" onClick={onClose} />
      <div
        className={`bt-cluster-menu ${flip ? "bt-cluster-menu-flip" : ""}`}
        style={{ left: clampedX, top: clampedY }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={`${menu.items.length} events`}
      >
        <div className="bt-cluster-menu-head">
          <span className="bt-cluster-menu-count">{menu.items.length} events</span>
          <span className="bt-cluster-menu-range">
            {fmtYr(menu.minYr)}
            {menu.minYr !== menu.maxYr && (<> — {fmtYr(menu.maxYr)}</>)}
          </span>
        </div>
        <div className="bt-cluster-menu-items">
          {menu.items.map(item => {
            const cfg = TYPE_CONFIG[item.type];
            return (
              <button
                key={`${item.label}-${item.year}`}
                className="bt-cluster-menu-item"
                onClick={() => onSelect(item)}
              >
                <span className="bt-cluster-menu-dot" style={{ background: cfg.ink, boxShadow: `0 0 10px ${cfg.ink}` }} />
                <div className="bt-cluster-menu-text">
                  <div className="bt-cluster-menu-label">{item.label}</div>
                  <div className="bt-cluster-menu-year">
                    {fmtYr(item.year)}{item.endYear ? ` – ${fmtYr(item.endYear)}` : ""}
                    <span className="bt-cluster-menu-cat" style={{ color: cfg.ink }}> · {cfg.label}</span>
                  </div>
                </div>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M4 2 L8 6 L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

/* ═══════════════ GLOSSARY POPOVER ═══════════════ */
function GlossaryPopover({ popover, onNavigate, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const entry = GLOSSARY[popover.term];
  if (!entry) return null;

  // Show the exact word the user clicked as the title, with other names as "also:" below
  const displayName = popover.display || popover.term;
  const alsoNames = [popover.term, ...(entry.aliases || [])]
    .filter(n => n.toLowerCase() !== displayName.toLowerCase());

  // Position: prefer below cursor, flip above if near bottom
  const estHeight = 220;
  const flip = typeof window !== "undefined" && popover.y + estHeight + 20 > window.innerHeight;
  const clampedX = typeof window !== "undefined"
    ? clamp(popover.x, 200, window.innerWidth - 200)
    : popover.x;
  const clampedY = typeof window !== "undefined"
    ? clamp(popover.y, 60, window.innerHeight - 20)
    : popover.y;

  return (
    <>
      <div className="bt-glossary-backdrop" onClick={onClose} />
      <div
        className={`bt-glossary-popover ${flip ? "flip" : ""}`}
        style={{ left: clampedX, top: clampedY }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={`Definition: ${popover.term}`}
      >
        <div className="bt-glossary-head">
          <div className="bt-glossary-eyebrow">Term</div>
          <button className="bt-glossary-close" onClick={onClose} aria-label="Close">
            <svg width="12" height="12" viewBox="0 0 12 12">
              <path d="M3 3 L9 9 M9 3 L3 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <h3 className="bt-glossary-term-title" key={displayName}>{displayName}</h3>
        {alsoNames.length > 0 && (
          <div className="bt-glossary-also" key={`also-${displayName}`}>
            <span className="bt-glossary-also-label">also:</span> {alsoNames.join(" · ")}
          </div>
        )}
        <p className="bt-glossary-def" key={`def-${displayName}`}>{entry.definition}</p>
        <a
          className="bt-glossary-wiki"
          href={wikiUrl(popover.term, entry.wiki)}
          target="_blank"
          rel="noopener noreferrer"
        >
          Read on Wikipedia
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M4 2 L10 2 L10 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 2 L5 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            <path d="M8 7 L8 10 L2 10 L2 4 L5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
        {entry.related && entry.related.length > 0 && (
          <div className="bt-glossary-related">
            <div className="bt-glossary-related-label">Related</div>
            <div className="bt-glossary-related-chips">
              {entry.related.map(rt => {
                if (!GLOSSARY[rt]) return null;
                return (
                  <button
                    key={rt}
                    className="bt-glossary-related-chip"
                    onClick={() => onNavigate(rt)}
                  >
                    {rt}
                    <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5 L8 5 M5 2 L8 5 L5 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* ═══════════════ HOVER TOOLTIP ═══════════════ */
function HoverTip({ hover }) {
  // Flip below cursor if near the top of viewport (not enough room for tip above)
  const estHeight = hover.kind === "cluster" ? 180 : 70;
  const flip = hover.y < estHeight + 24;
  // Clamp horizontally so tip doesn't clip left/right viewport edges
  const clampedX = typeof window !== "undefined"
    ? clamp(hover.x, 140, window.innerWidth - 140)
    : hover.x;
  return (
    <div
      className={`bt-tip ${flip ? "bt-tip-flip" : ""}`}
      style={{
        left: clampedX,
        top: hover.y,
        borderColor: hover.color + "55",
      }}
    >
      <div className="bt-tip-label">{hover.label}</div>
      <div className="bt-tip-meta">{hover.meta}</div>
      {hover.kind === "cluster" && hover.items && (
        <div className="bt-tip-items">
          {hover.items.map((it, i) => (
            <div key={i} className="bt-tip-item">
              <span className="bt-tip-item-dot" style={{ background: TYPE_CONFIG[it.type].ink }} />
              <span className="bt-tip-item-label">{it.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════ READER (integrated push panel) ═══════════════ */
function Reader({ item, items, onPrev, onNext, onClose, onSelectRelated, onTermClick, soloView, onToggleSoloView }) {
  const h = onTermClick || ((t, e) => {});
  const cfg = TYPE_CONFIG[item.type];
  const idx = items.findIndex(d => d.label === item.label && d.year === item.year);
  const atStart = idx <= 0;
  const atEnd = idx >= items.length - 1;

  return (
    <div className="bt-reader" role="dialog" aria-label={item.label}>
      <div className="bt-reader-accent" style={{ background: `linear-gradient(90deg, transparent, ${cfg.ink}, transparent)` }} />

      <div className="bt-reader-top">
        <div className="bt-reader-meta">
          <span className="bt-reader-chip" style={{ color: cfg.ink, borderColor: cfg.ink + "55" }}>
            <span className="bt-reader-dot" style={{ background: cfg.ink, boxShadow: `0 0 10px ${cfg.ink}` }} />
            {cfg.label}
          </span>
          <span className="bt-reader-year">
            {fmtYr(item.year)}{item.endYear ? ` – ${fmtYr(item.endYear)}` : ""}
          </span>
          <a
            className="bt-reader-wiki"
            href={wikiUrl(item.wiki || item.label)}
            target="_blank"
            rel="noopener noreferrer"
            title={`Read "${item.label}" on Wikipedia`}
          >
            Wikipedia
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M4 2 L10 2 L10 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 2 L5 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              <path d="M8 7 L8 10 L2 10 L2 4 L5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          {(() => {
            const canons = item.canons || CANON_DEFAULTS[item.type] || [];
            return canons.length > 0 ? (
              <div className="bt-reader-canons">
                {canons.map(c => (
                  <span key={c} className={`bt-canon-badge bt-canon-${c}`}>{CANON_LABELS[c]}</span>
                ))}
              </div>
            ) : null;
          })()}
        </div>
        <div className="bt-reader-counter">
          <span className="bt-reader-idx">{String(idx + 1).padStart(2, "0")}</span>
          <span className="bt-reader-sep">/</span>
          <span className="bt-reader-tot">{String(items.length).padStart(2, "0")}</span>
        </div>
        {item.storyStart != null && onToggleSoloView && (
          <button
            className={`bt-reader-solo ${soloView ? "active" : ""}`}
            onClick={onToggleSoloView}
            title={soloView ? "Exit solo view" : "Solo view — show story period & date written"}
            aria-pressed={soloView}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="4" width="12" height="2" rx="1" fill="currentColor" opacity="0.4" />
              <rect x="3" y="8" width="5" height="2" rx="1" fill="currentColor" />
              <circle cx="11" cy="9" r="2" stroke="currentColor" strokeWidth="1.3" fill="none" />
            </svg>
            {soloView ? "Exit solo" : "Solo view"}
          </button>
        )}
        <button className="bt-close" onClick={onClose} aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path d="M3 3 L11 11 M11 3 L3 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="bt-reader-body">
        <button
          className="bt-reader-nav bt-reader-prev"
          onClick={onPrev}
          disabled={atStart}
          aria-label="Previous event"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 4 L6 10 L12 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="bt-reader-nav-label">Prev</span>
        </button>

        <div className="bt-reader-content" key={`${item.label}-${item.year}`}>
          <h2 className="bt-reader-title">{item.label}</h2>
          <p className="bt-reader-detail">{highlightTerms(item.detail, h)}</p>

          {item.quote && (
            <blockquote className="bt-reader-quote" style={{ borderLeftColor: cfg.ink }}>
              {item.quote}
            </blockquote>
          )}

          {item.significance && (
            <div className="bt-reader-section">
              <div className="bt-reader-section-label" style={{ color: cfg.ink }}>Why it matters</div>
              <p className="bt-reader-section-body">{highlightTerms(item.significance, h)}</p>
            </div>
          )}

          {(item.attributed || item.scholarly || item.dispute) && (
            <div className="bt-reader-fields">
              {item.attributed && (
                <div className="bt-field">
                  <div className="bt-field-key" style={{ color: cfg.ink }}>Traditional author</div>
                  <div className="bt-field-val">{item.attributed}</div>
                </div>
              )}
              {item.scholarly && (
                <div className="bt-field">
                  <div className="bt-field-key" style={{ color: cfg.ink }}>Scholarly view</div>
                  <div className="bt-field-val">{highlightTerms(item.scholarly, h)}</div>
                </div>
              )}
              {item.dispute && (
                <div className="bt-field">
                  <div className="bt-field-key" style={{ color: cfg.ink }}>Dispute level</div>
                  <div className="bt-field-val">{highlightTerms(item.dispute, h)}</div>
                </div>
              )}
            </div>
          )}

          {item.sources && item.sources.length > 0 && (
            <div className="bt-reader-section">
              <div className="bt-reader-section-label" style={{ color: cfg.ink }}>Sources</div>
              <ul className="bt-reader-sources">
                {item.sources.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}

          {item.relatedEvents && item.relatedEvents.length > 0 && onSelectRelated && (
            <div className="bt-reader-section">
              <div className="bt-reader-section-label" style={{ color: cfg.ink }}>See also</div>
              <div className="bt-reader-related">
                {item.relatedEvents.map(label => {
                  const target = TIMELINE_DATA.find(d => d.label === label);
                  if (!target) return null;
                  const tCfg = TYPE_CONFIG[target.type];
                  return (
                    <button
                      key={label}
                      className="bt-reader-related-chip"
                      onClick={() => onSelectRelated(label)}
                      style={{ "--rc": tCfg.ink }}
                    >
                      <span className="bt-reader-related-dot" style={{ background: tCfg.ink }} />
                      {label}
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5 L8 5 M5 2 L8 5 L5 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <button
          className="bt-reader-nav bt-reader-next"
          onClick={onNext}
          disabled={atEnd}
          aria-label="Next event"
        >
          <span className="bt-reader-nav-label">Next</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M8 4 L14 10 L8 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ═══════════════ STYLES ═══════════════ */
function Styles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300..700&family=Geist+Mono:wght@400;500;600&family=Instrument+Serif:ital@0;1&display=swap');

      :root {
        --bg:       #0A0A0B;
        --bg-1:     #101012;
        --bg-2:     #15151A;
        --bg-3:     #1D1D23;
        --line:     rgba(255, 255, 255, 0.08);
        --line-2:   rgba(255, 255, 255, 0.14);
        --text:     #F4F4F5;
        --text-2:   #A1A1AA;
        --text-3:   #71717A;
        --text-4:   #52525B;
        --accent:   #F5A524;
        --accent-2: #FDE68A;
      }

      .bt-root {
        font-family: 'Geist', -apple-system, ui-sans-serif, sans-serif;
        background: var(--bg);
        color: var(--text);
        height: 100vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        -webkit-font-smoothing: antialiased;
        letter-spacing: -0.005em;
      }
      .bt-root *, .bt-root *::before, .bt-root *::after { box-sizing: border-box; }
      .bt-root button { font-family: inherit; }

      /* ─── HEADER ─── */
      .bt-header {
        flex-shrink: 0;
        padding: 16px 28px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
        border-bottom: 1px solid var(--line);
        background: linear-gradient(180deg, rgba(255,255,255,0.025), transparent);
        backdrop-filter: blur(12px);
      }
      .bt-brand { display: flex; align-items: center; gap: 14px; min-width: 0; }
      .bt-mark {
        width: 38px; height: 38px;
        border-radius: 10px;
        background: linear-gradient(135deg, #1C1C22, #0A0A0B);
        border: 1px solid var(--line-2);
        display: inline-flex; align-items: center; justify-content: center;
        color: var(--accent);
        box-shadow: 0 0 24px rgba(245,165,36,0.12), inset 0 1px 0 rgba(255,255,255,0.04);
        cursor: pointer;
        transition: all 200ms cubic-bezier(0.2, 0.9, 0.3, 1);
        padding: 0;
        font-family: inherit;
      }
      .bt-mark:hover {
        border-color: color-mix(in srgb, var(--accent) 50%, transparent);
        box-shadow: 0 0 32px rgba(245,165,36,0.2), inset 0 1px 0 rgba(255,255,255,0.06);
        transform: scale(1.05);
      }
      .bt-mark:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
      .bt-brand-name {
        font-family: 'Instrument Serif', 'Geist', serif;
        font-size: 22px;
        font-weight: 400;
        letter-spacing: -0.015em;
        line-height: 1.1;
        color: var(--text);
      }
      .bt-amp {
        font-style: italic;
        color: var(--accent);
        font-family: 'Instrument Serif', serif;
      }
      .bt-brand-sub {
        font-size: 11px;
        color: var(--text-3);
        letter-spacing: 0.02em;
        margin-top: 1px;
        font-variant-numeric: tabular-nums;
      }
      .bt-filters {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .bt-chip-wrap {
        display: inline-flex;
        align-items: stretch;
        border: 1px solid var(--line);
        background: rgba(255,255,255,0.015);
        border-radius: 999px;
        overflow: hidden;
        transition: all 180ms cubic-bezier(0.2, 0.9, 0.3, 1);
      }
      .bt-chip-wrap:hover {
        transform: translateY(-1px);
        border-color: var(--line-2);
      }
      .bt-chip-wrap.on {
        border-color: color-mix(in srgb, var(--chip) 40%, transparent);
        background: color-mix(in srgb, var(--chip) 8%, transparent);
      }
      .bt-chip-wrap.solo {
        box-shadow: 0 0 0 1px color-mix(in srgb, var(--chip) 50%, transparent),
                    0 0 16px color-mix(in srgb, var(--chip) 28%, transparent);
      }
      .bt-chip {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        padding: 7px 10px 7px 11px;
        border: none;
        background: transparent;
        color: var(--text-3);
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        letter-spacing: 0.01em;
        font-family: inherit;
      }
      .bt-chip-wrap.on .bt-chip { color: var(--chip); }
      .bt-chip-dot {
        width: 7px; height: 7px;
        border-radius: 50%;
        background: var(--text-4);
        transition: all 180ms ease;
      }
      .bt-chip:focus-visible {
        outline: 2px solid var(--accent);
        outline-offset: 2px;
      }
      .bt-chip-solo {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0 9px;
        border: none;
        border-left: 1px solid var(--line);
        background: transparent;
        color: var(--text-4);
        cursor: pointer;
        transition: all 160ms ease;
        font-family: inherit;
      }
      .bt-chip-wrap.on .bt-chip-solo {
        border-left-color: color-mix(in srgb, var(--chip) 30%, transparent);
        color: color-mix(in srgb, var(--chip) 75%, var(--text-3));
      }
      .bt-chip-solo:hover {
        background: rgba(255,255,255,0.05);
        color: var(--text);
      }
      .bt-chip-wrap.on .bt-chip-solo:hover {
        background: color-mix(in srgb, var(--chip) 16%, transparent);
        color: var(--chip);
      }
      .bt-chip-wrap.solo .bt-chip-solo {
        color: var(--chip);
        background: color-mix(in srgb, var(--chip) 14%, transparent);
      }
      .bt-chip-solo:focus-visible {
        outline: 2px solid var(--accent);
        outline-offset: -2px;
      }

      /* ─── Info Overlay ─── */
      .bt-info-overlay {
        position: fixed;
        inset: 0;
        z-index: 100;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: btInfoIn 300ms cubic-bezier(0.2, 0.9, 0.3, 1);
      }
      @keyframes btInfoIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      .bt-info-backdrop {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
      }
      .bt-info-card {
        position: relative;
        width: min(680px, calc(100vw - 32px));
        max-height: min(85vh, 720px);
        background: rgba(18, 18, 22, 0.97);
        backdrop-filter: blur(28px) saturate(1.4);
        -webkit-backdrop-filter: blur(28px) saturate(1.4);
        border: 1px solid var(--line-2);
        border-radius: 16px;
        box-shadow:
          0 1px 0 rgba(255,255,255,0.05) inset,
          0 32px 80px -16px rgba(0,0,0,0.8),
          0 12px 32px -8px rgba(0,0,0,0.5);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      .bt-info-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 20px 0;
        flex-shrink: 0;
      }
      .bt-info-tabs {
        display: flex;
        gap: 2px;
        background: rgba(255,255,255,0.04);
        border-radius: 8px;
        padding: 3px;
      }
      .bt-info-tab {
        padding: 8px 18px;
        border-radius: 6px;
        border: none;
        background: transparent;
        color: var(--text-3);
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.02em;
        cursor: pointer;
        font-family: inherit;
        transition: all 160ms ease;
      }
      .bt-info-tab:hover { color: var(--text); }
      .bt-info-tab.active {
        background: rgba(255,255,255,0.08);
        color: var(--text);
        box-shadow: 0 1px 3px rgba(0,0,0,0.3);
      }
      .bt-info-tab:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
      .bt-info-body {
        flex: 1;
        overflow-y: auto;
        padding: 20px 24px 28px;
      }
      .bt-info-section {
        display: flex;
        gap: 14px;
        padding: 16px 0;
        border-bottom: 1px solid var(--line);
      }
      .bt-info-section:last-child { border-bottom: none; }
      .bt-info-icon {
        width: 36px;
        height: 36px;
        border-radius: 8px;
        background: rgba(245,165,36,0.1);
        border: 1px solid rgba(245,165,36,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        color: var(--accent);
      }
      .bt-info-section h3 {
        font-family: 'Geist', sans-serif;
        font-size: 13px;
        font-weight: 600;
        margin: 0 0 5px;
        color: var(--text);
        letter-spacing: 0.01em;
      }
      .bt-info-section p {
        font-size: 12.5px;
        line-height: 1.6;
        color: var(--text-2);
        margin: 0;
      }
      .bt-info-section kbd {
        font-family: 'Geist Mono', monospace;
        font-size: 10px;
        padding: 2px 6px;
        border-radius: 4px;
        background: rgba(255,255,255,0.06);
        border: 1px solid var(--line);
        color: var(--text-3);
      }

      /* About tab */
      .bt-info-about-hero {
        display: flex;
        align-items: center;
        gap: 16px;
        padding-bottom: 20px;
        border-bottom: 1px solid var(--line);
        margin-bottom: 20px;
      }
      .bt-info-about-mark {
        width: 56px;
        height: 56px;
        border-radius: 14px;
        background: linear-gradient(135deg, #1C1C22, #0A0A0B);
        border: 1px solid var(--line-2);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 24px rgba(245,165,36,0.12);
      }
      .bt-info-about-title {
        font-family: 'Instrument Serif', 'Geist', serif;
        font-size: 28px;
        font-weight: 400;
        margin: 0;
        color: var(--text);
        letter-spacing: -0.015em;
      }
      .bt-info-about-tagline {
        font-size: 13px;
        color: var(--text-3);
        font-style: italic;
        margin: 4px 0 0;
      }
      .bt-info-about-section {
        margin-bottom: 22px;
      }
      .bt-info-about-section h3 {
        font-family: 'Geist Mono', monospace;
        font-size: 9.5px;
        font-weight: 700;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--accent);
        margin: 0 0 8px;
      }
      .bt-info-about-section p {
        font-size: 13px;
        line-height: 1.65;
        color: var(--text-2);
        margin: 0 0 10px;
        max-width: 58ch;
      }
      .bt-info-about-section ul {
        margin: 8px 0 0;
        padding: 0 0 0 20px;
        font-size: 12.5px;
        line-height: 1.7;
        color: var(--text-2);
      }
      .bt-info-about-section li { margin-bottom: 4px; }
      .bt-info-email {
        color: var(--accent);
        text-decoration: none;
        border-bottom: 1px solid color-mix(in srgb, var(--accent) 40%, transparent);
        transition: all 140ms ease;
      }
      .bt-info-email:hover {
        border-bottom-color: var(--accent);
      }
      .bt-info-about-footer {
        padding-top: 18px;
        border-top: 1px solid var(--line);
        margin-top: 8px;
      }
      .bt-info-about-footer p {
        font-size: 11px;
        color: var(--text-4);
        margin: 0;
      }
      .bt-info-about-footer a {
        color: var(--text-3);
        text-decoration: none;
        border-bottom: 1px solid var(--line);
        transition: color 140ms ease;
      }
      .bt-info-about-footer a:hover { color: var(--text); }

      @media (max-width: 720px) {
        .bt-info-card { border-radius: 12px; }
        .bt-info-body { padding: 16px 18px 24px; }
        .bt-info-about-title { font-size: 22px; }
      }

      /* ─── Header right (filter toggle + count) ─── */
      .bt-header-right {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .bt-header-count {
        font-family: 'Geist Mono', ui-monospace, monospace;
        font-size: 11px;
        color: var(--text-3);
        font-variant-numeric: tabular-nums;
      }
      .bt-header-count b {
        color: var(--text);
        font-weight: 600;
      }
      .bt-filter-toggle {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        padding: 7px 14px 7px 11px;
        border-radius: 8px;
        border: 1px solid var(--line);
        background: rgba(255,255,255,0.02);
        color: var(--text-3);
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        font-family: inherit;
        transition: all 160ms cubic-bezier(0.2, 0.9, 0.3, 1);
        position: relative;
      }
      .bt-filter-toggle:hover {
        color: var(--text);
        border-color: var(--line-2);
        background: rgba(255,255,255,0.04);
      }
      .bt-filter-toggle.open {
        color: var(--accent);
        border-color: color-mix(in srgb, var(--accent) 40%, transparent);
        background: color-mix(in srgb, var(--accent) 8%, transparent);
      }
      .bt-filter-badge {
        position: absolute;
        top: -3px;
        right: -3px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--accent);
        box-shadow: 0 0 8px var(--accent);
      }
      .bt-filter-toggle:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

      /* ─── Filter Panel ─── */
      .bt-fp {
        flex-shrink: 0;
        background: rgba(14, 14, 18, 0.96);
        backdrop-filter: blur(16px);
        border-bottom: 1px solid var(--line);
        animation: btFpIn 300ms cubic-bezier(0.2, 0.9, 0.3, 1);
        overflow: hidden;
      }
      @keyframes btFpIn {
        from { max-height: 0; opacity: 0; }
        to   { max-height: 600px; opacity: 1; }
      }
      .bt-fp-head {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 12px 28px;
        border-bottom: 1px solid var(--line);
      }
      .bt-fp-title {
        font-family: 'Geist Mono', ui-monospace, monospace;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: var(--accent);
      }
      .bt-fp-summary {
        font-size: 11px;
        color: var(--text-3);
        font-variant-numeric: tabular-nums;
      }
      .bt-fp-summary b { color: var(--text); font-weight: 600; }
      .bt-fp-reset {
        margin-left: auto;
        padding: 4px 10px;
        border-radius: 6px;
        border: 1px solid var(--line);
        background: transparent;
        color: var(--text-3);
        font-size: 10px;
        font-weight: 600;
        cursor: pointer;
        font-family: inherit;
        transition: all 140ms ease;
      }
      .bt-fp-reset:hover { color: var(--accent); border-color: color-mix(in srgb, var(--accent) 50%, transparent); }
      .bt-fp-close {
        width: 28px; height: 28px;
        border-radius: 7px;
        border: 1px solid var(--line);
        background: transparent;
        color: var(--text-3);
        cursor: pointer;
        display: inline-flex; align-items: center; justify-content: center;
        flex-shrink: 0;
        transition: all 140ms ease;
      }
      .bt-fp-close:hover { color: var(--text); border-color: var(--line-2); }

      .bt-fp-body {
        padding: 12px 28px 16px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        max-height: 380px;
        overflow-y: auto;
      }
      .bt-fp-group {  }
      .bt-fp-group-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;
      }
      .bt-fp-group-toggle {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        background: transparent;
        border: none;
        padding: 0;
        font-family: 'Geist Mono', ui-monospace, monospace;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--text-2);
        cursor: pointer;
      }
      .bt-fp-group-toggle:hover { color: var(--text); }
      .bt-fp-chevron {
        transition: transform 200ms ease;
      }
      .bt-fp-chevron.open { transform: rotate(90deg); }
      .bt-fp-group-actions {
        display: flex;
        gap: 4px;
      }
      .bt-fp-bulk {
        padding: 2px 8px;
        border-radius: 4px;
        border: 1px solid var(--line);
        background: transparent;
        color: var(--text-4);
        font-size: 9px;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        cursor: pointer;
        font-family: inherit;
        transition: all 140ms ease;
      }
      .bt-fp-bulk:hover { color: var(--text-2); border-color: var(--line-2); }
      .bt-fp-bulk.active { color: var(--accent); border-color: color-mix(in srgb, var(--accent) 40%, transparent); }

      .bt-fp-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
      }
      .bt-fp-chip {
        display: inline-flex;
        align-items: stretch;
        border: 1px solid var(--line);
        background: rgba(255,255,255,0.015);
        border-radius: 999px;
        overflow: hidden;
        transition: all 140ms ease;
      }
      .bt-fp-chip.on {
        border-color: color-mix(in srgb, var(--fpc) 40%, transparent);
        background: color-mix(in srgb, var(--fpc) 8%, transparent);
      }
      .bt-fp-chip.solo {
        box-shadow: 0 0 0 1px color-mix(in srgb, var(--fpc) 50%, transparent),
                    0 0 12px color-mix(in srgb, var(--fpc) 20%, transparent);
      }
      .bt-fp-chip-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 5px 8px 5px 8px;
        border: none;
        background: transparent;
        color: var(--text-3);
        font-size: 11px;
        font-weight: 500;
        cursor: pointer;
        font-family: inherit;
      }
      .bt-fp-chip.on .bt-fp-chip-btn { color: var(--fpc); }
      .bt-fp-chip-dot {
        width: 6px; height: 6px;
        border-radius: 50%;
        background: var(--text-4);
        flex-shrink: 0;
        transition: all 140ms ease;
      }
      .bt-fp-chip-count {
        font-family: 'Geist Mono', monospace;
        font-size: 9px;
        color: var(--text-4);
        margin-left: 2px;
      }
      .bt-fp-chip.on .bt-fp-chip-count { color: color-mix(in srgb, var(--fpc) 70%, var(--text-4)); }
      .bt-fp-chip-solo {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0 7px;
        border: none;
        border-left: 1px solid var(--line);
        background: transparent;
        color: var(--text-4);
        cursor: pointer;
        transition: all 140ms ease;
        font-family: inherit;
      }
      .bt-fp-chip.on .bt-fp-chip-solo {
        border-left-color: color-mix(in srgb, var(--fpc) 25%, transparent);
        color: color-mix(in srgb, var(--fpc) 60%, var(--text-4));
      }
      .bt-fp-chip-solo:hover { background: rgba(255,255,255,0.05); color: var(--text); }
      .bt-fp-chip.on .bt-fp-chip-solo:hover { color: var(--fpc); }
      .bt-fp-chip-btn:focus-visible, .bt-fp-chip-solo:focus-visible {
        outline: 2px solid var(--accent); outline-offset: 2px;
      }

      .bt-fp-tradition-label {
        font-family: 'Geist Mono', ui-monospace, monospace;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--text-2);
      }
      .bt-fp-tradition {
        display: inline-flex;
        align-items: center;
        padding: 5px 10px;
        border-radius: 6px;
        border: 1px solid var(--line);
        background: transparent;
        color: var(--text-4);
        font-size: 10px;
        font-weight: 500;
        cursor: pointer;
        font-family: inherit;
        transition: all 140ms ease;
      }
      .bt-fp-tradition.on {
        border-color: var(--line-2);
        background: rgba(255,255,255,0.03);
        color: var(--text-2);
      }
      .bt-fp-tradition:hover { border-color: var(--line-2); color: var(--text); }
      .bt-fp-tradition:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

      /* ─── MAIN ─── */
      .bt-main {
        flex: 1;
        min-height: 240px;
        position: relative;
        border-bottom: 1px solid var(--line);
        background: var(--bg);
        overflow: hidden;
      }
      .bt-grid-bg {
        position: absolute;
        inset: 0;
        background-image:
          radial-gradient(circle at 50% 50%, rgba(255,255,255,0.025) 1px, transparent 1.5px);
        background-size: 28px 28px;
        background-position: 0 0;
        pointer-events: none;
        mask-image: radial-gradient(ellipse 80% 70% at 50% 50%, black 40%, transparent 100%);
        -webkit-mask-image: radial-gradient(ellipse 80% 70% at 50% 50%, black 40%, transparent 100%);
      }
      .bt-scroll {
        position: relative;
        height: 100%;
        overflow-x: auto;
        overflow-y: hidden;
      }
      .bt-scroll:focus-visible { outline: none; }
      .bt-svg { display: block; }

      .bt-era {
        font-family: 'Geist Mono', ui-monospace, monospace;
        font-size: 9px;
        fill: var(--text-4);
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }
      .bt-year {
        font-family: 'Geist Mono', ui-monospace, monospace;
        font-size: 9.5px;
        font-weight: 500;
        letter-spacing: 0.03em;
      }
      .bt-label {
        font-family: 'Geist', sans-serif;
        font-size: 12px;
        font-weight: 500;
        fill: var(--text-2);
        letter-spacing: -0.005em;
        transition: fill 180ms ease;
      }
      .bt-label.sel { fill: var(--text); font-weight: 600; }
      .bt-label.pin {
        fill: var(--text);
        font-weight: 600;
        font-size: 13px;
        letter-spacing: -0.01em;
      }
      .bt-year.pin {
        font-size: 10.5px;
        font-weight: 600;
      }
      .bt-event:hover .bt-label { fill: var(--text); }
      .bt-event.pin:hover .bt-label { fill: #FFFFFF; }

      .bt-event { cursor: pointer; }
      .bt-label-bg {
        fill: rgba(10, 10, 11, 0.78);
        stroke: rgba(255, 255, 255, 0.04);
        stroke-width: 0.5;
        transition: fill 180ms ease, stroke 180ms ease;
        pointer-events: none;
      }
      .bt-event:hover .bt-label-bg,
      .bt-event.sel .bt-label-bg,
      .bt-event.hov .bt-label-bg {
        fill: rgba(18, 18, 22, 0.96);
        stroke: rgba(255, 255, 255, 0.12);
      }
      .bt-event.pin .bt-label-bg {
        fill: rgba(10, 10, 11, 0.88);
      }
      .bt-marker-scale {
        transform-box: fill-box;
        transform-origin: center;
        transition: transform 180ms cubic-bezier(0.2, 0.9, 0.3, 1);
      }
      .bt-event:hover .bt-marker-scale { transform: scale(1.15); }
      .bt-event.sel .bt-marker-scale { transform: scale(1.2); }

      .bt-cluster { cursor: pointer; }
      .bt-cluster rect { transition: all 220ms cubic-bezier(0.2, 0.9, 0.3, 1); }
      .bt-cluster:hover rect:first-of-type { filter: brightness(1.4); }
      .bt-cluster-num {
        font-family: 'Geist Mono', ui-monospace, monospace;
        font-size: 12px;
        font-weight: 600;
        fill: var(--text);
        letter-spacing: 0;
      }

      /* ─── Solo-book story↔written visualization ─── */
      .bt-solo-book {
        animation: btSoloIn 600ms cubic-bezier(0.2, 0.9, 0.3, 1);
      }
      @keyframes btSoloIn {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      .bt-solo-label {
        font-family: 'Geist Mono', ui-monospace, monospace;
        font-size: 10px;
        font-weight: 500;
        fill: var(--text-2);
        letter-spacing: 0.03em;
        font-variant-numeric: tabular-nums;
      }
      .bt-solo-label-written {
        fill: var(--text);
        font-weight: 600;
      }
      .bt-solo-connector {
        animation: btSoloDash 12s linear infinite;
      }
      @keyframes btSoloDash {
        to { stroke-dashoffset: -100; }
      }

      .bt-empty {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 14px;
        color: var(--text-3);
        font-size: 13px;
      }

      .bt-scroll::-webkit-scrollbar { height: 10px; }
      .bt-scroll::-webkit-scrollbar-track { background: transparent; }
      .bt-scroll::-webkit-scrollbar-thumb {
        background: rgba(255,255,255,0.08);
        border-radius: 10px;
        border: 2px solid var(--bg);
      }
      .bt-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.16); }

      /* ─── NAVIGATOR ─── */
      .bt-nav-host {
        flex-shrink: 0;
        padding: 12px 28px 14px;
        background: linear-gradient(180deg, var(--bg), var(--bg-1));
      }
      .bt-nav-meta {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 8px;
        font-size: 11px;
        color: var(--text-3);
      }
      .bt-nav-range { display: inline-flex; align-items: center; gap: 8px; }
      .bt-nav-range-val {
        font-family: 'Geist Mono', ui-monospace, monospace;
        font-size: 12px;
        font-weight: 500;
        color: var(--text);
        font-variant-numeric: tabular-nums;
        letter-spacing: 0.01em;
      }
      .bt-nav-range-arrow { color: var(--text-4); display: inline-flex; }
      .bt-nav-dot {
        width: 3px; height: 3px; border-radius: 50%;
        background: var(--text-4);
      }
      .bt-nav-span { display: inline-flex; align-items: baseline; gap: 4px; }
      .bt-nav-span b {
        font-family: 'Geist Mono', ui-monospace, monospace;
        font-size: 12px;
        font-weight: 600;
        color: var(--text);
        font-variant-numeric: tabular-nums;
      }
      .bt-nav-unit { color: var(--text-3); font-size: 10.5px; margin-right: 4px; }
      .bt-nav-pct {
        padding: 1px 6px;
        border-radius: 4px;
        background: rgba(245,165,36,0.1);
        color: var(--accent);
        font-family: 'Geist Mono', monospace;
        font-size: 10px;
        font-weight: 600;
      }
      .bt-nav-tools { margin-left: auto; display: flex; gap: 4px; }
      .bt-btn-icon {
        width: 28px; height: 28px;
        border-radius: 7px;
        border: 1px solid var(--line);
        background: rgba(255,255,255,0.02);
        color: var(--text-3);
        cursor: pointer;
        display: inline-flex; align-items: center; justify-content: center;
        transition: all 160ms cubic-bezier(0.2, 0.9, 0.3, 1);
      }
      .bt-btn-icon:hover {
        color: var(--text);
        border-color: var(--line-2);
        background: rgba(255,255,255,0.05);
      }
      .bt-btn-icon:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

      .bt-nav-track-wrap {
        width: 100%;
        display: block;
      }
      .bt-nav-svg {
        display: block;
        width: 100%;
        max-width: 100%;
        user-select: none;
        touch-action: none;
        overflow: hidden;
      }
      .bt-nav-era {
        font-family: 'Geist Mono', ui-monospace, monospace;
        font-size: 8px;
        fill: var(--text-4);
        letter-spacing: 0.03em;
      }
      .bt-nav-hint {
        font-size: 10px;
        color: var(--text-4);
        margin-top: 8px;
        text-align: center;
        letter-spacing: 0.01em;
      }
      .bt-nav-hint kbd {
        font-family: 'Geist Mono', monospace;
        font-size: 9px;
        padding: 1px 5px;
        margin: 0 1px;
        border-radius: 4px;
        background: rgba(255,255,255,0.04);
        border: 1px solid var(--line);
        color: var(--text-3);
      }

      /* ─── HOVER TOOLTIP ─── */
      .bt-tip {
        position: fixed;
        transform: translate(-50%, calc(-100% - 20px));
        pointer-events: none;
        background: rgba(15, 15, 18, 0.92);
        backdrop-filter: blur(16px) saturate(1.2);
        -webkit-backdrop-filter: blur(16px) saturate(1.2);
        border: 1px solid var(--line-2);
        border-radius: 10px;
        padding: 9px 12px 10px;
        min-width: 160px;
        max-width: 260px;
        box-shadow: 0 12px 32px rgba(0,0,0,0.5), 0 2px 6px rgba(0,0,0,0.3);
        z-index: 50;
        animation: btTipIn 120ms cubic-bezier(0.2, 0.9, 0.3, 1);
      }
      .bt-tip-flip {
        transform: translate(-50%, 20px);
      }
      @keyframes btTipIn {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      .bt-tip-label {
        font-size: 12px;
        font-weight: 600;
        color: var(--text);
        line-height: 1.3;
      }
      .bt-tip-meta {
        font-family: 'Geist Mono', monospace;
        font-size: 10px;
        color: var(--text-3);
        margin-top: 3px;
        font-variant-numeric: tabular-nums;
      }
      .bt-tip-items {
        margin-top: 8px;
        padding-top: 8px;
        border-top: 1px solid var(--line);
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      /* ─── Cluster popover menu ─── */
      .bt-cluster-menu-backdrop {
        position: fixed;
        inset: 0;
        z-index: 60;
        background: transparent;
      }
      .bt-cluster-menu {
        position: fixed;
        transform: translate(-50%, calc(-100% - 18px));
        max-height: 70vh;
        overflow-y: auto;
        min-width: 260px;
        max-width: 340px;
        background: rgba(18, 18, 22, 0.94);
        backdrop-filter: blur(28px) saturate(1.4);
        -webkit-backdrop-filter: blur(28px) saturate(1.4);
        border: 1px solid var(--line-2);
        border-radius: 12px;
        padding: 8px;
        box-shadow:
          0 1px 0 rgba(255,255,255,0.05) inset,
          0 24px 64px -12px rgba(0,0,0,0.8),
          0 8px 24px -8px rgba(0,0,0,0.5);
        z-index: 61;
        animation: btMenuIn 200ms cubic-bezier(0.2, 0.9, 0.3, 1);
      }
      @keyframes btMenuIn {
        from { opacity: 0; transform: translate(-50%, calc(-100% - 10px)); }
        to   { opacity: 1; transform: translate(-50%, calc(-100% - 18px)); }
      }
      .bt-cluster-menu-flip {
        transform: translate(-50%, 18px);
      }
      .bt-cluster-menu-head {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 12px;
        padding: 8px 12px 10px;
        border-bottom: 1px solid var(--line);
        margin-bottom: 6px;
      }
      .bt-cluster-menu-count {
        font-size: 12px;
        font-weight: 600;
        color: var(--text);
        letter-spacing: 0.01em;
      }
      .bt-cluster-menu-range {
        font-family: 'Geist Mono', ui-monospace, monospace;
        font-size: 10px;
        color: var(--text-3);
        font-variant-numeric: tabular-nums;
      }
      .bt-cluster-menu-items {
        display: flex;
        flex-direction: column;
        gap: 1px;
      }
      .bt-cluster-menu-item {
        display: flex;
        align-items: center;
        gap: 11px;
        padding: 9px 10px 9px 12px;
        border-radius: 8px;
        border: none;
        background: transparent;
        color: var(--text-2);
        text-align: left;
        cursor: pointer;
        transition: all 140ms ease;
        font-family: inherit;
        width: 100%;
      }
      .bt-cluster-menu-item:hover {
        background: rgba(255, 255, 255, 0.05);
        color: var(--text);
      }
      .bt-cluster-menu-item:focus-visible {
        outline: 2px solid var(--accent);
        outline-offset: -2px;
      }
      .bt-cluster-menu-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        flex-shrink: 0;
      }
      .bt-cluster-menu-text {
        flex: 1;
        min-width: 0;
      }
      .bt-cluster-menu-label {
        font-size: 13px;
        font-weight: 500;
        color: var(--text);
        letter-spacing: -0.005em;
      }
      .bt-cluster-menu-year {
        font-family: 'Geist Mono', ui-monospace, monospace;
        font-size: 10px;
        color: var(--text-3);
        margin-top: 2px;
        font-variant-numeric: tabular-nums;
      }
      .bt-cluster-menu-cat {
        font-weight: 500;
      }
      .bt-cluster-menu-item svg {
        color: var(--text-4);
        transition: all 140ms ease;
        flex-shrink: 0;
      }
      .bt-cluster-menu-item:hover svg {
        color: var(--text-2);
        transform: translateX(2px);
      }

      /* ─── Glossary inline terms ─── */
      .bt-glossary-term {
        display: inline;
        padding: 0 2px;
        margin: 0 -2px;
        border: none;
        background: transparent;
        color: inherit;
        font: inherit;
        letter-spacing: inherit;
        cursor: help;
        border-bottom: 1px dotted color-mix(in srgb, var(--accent) 55%, transparent);
        border-radius: 2px;
        transition: color 140ms ease, border-color 140ms ease, background 140ms ease;
      }
      .bt-glossary-term:hover {
        color: var(--accent);
        border-bottom: 1px solid var(--accent);
        background: color-mix(in srgb, var(--accent) 12%, transparent);
      }
      .bt-glossary-term:focus-visible {
        outline: 2px solid var(--accent);
        outline-offset: 2px;
      }

      /* ─── Glossary popover ─── */
      .bt-glossary-backdrop {
        position: fixed;
        inset: 0;
        z-index: 70;
        background: transparent;
      }
      .bt-glossary-popover {
        position: fixed;
        transform: translate(-50%, calc(-100% - 14px));
        width: min(360px, calc(100vw - 32px));
        background: rgba(18, 18, 22, 0.96);
        backdrop-filter: blur(28px) saturate(1.4);
        -webkit-backdrop-filter: blur(28px) saturate(1.4);
        border: 1px solid color-mix(in srgb, var(--accent) 32%, var(--line-2));
        border-radius: 12px;
        padding: 14px 16px 16px;
        box-shadow:
          0 1px 0 rgba(255,255,255,0.05) inset,
          0 0 0 1px color-mix(in srgb, var(--accent) 14%, transparent),
          0 24px 64px -12px rgba(0,0,0,0.8),
          0 8px 24px -8px rgba(0,0,0,0.5);
        z-index: 71;
        animation: btGlossaryIn 200ms cubic-bezier(0.2, 0.9, 0.3, 1);
      }
      .bt-glossary-popover.flip {
        transform: translate(-50%, 14px);
      }
      @keyframes btGlossaryIn {
        from { opacity: 0; transform: translate(-50%, calc(-100% - 6px)); }
        to   { opacity: 1; transform: translate(-50%, calc(-100% - 14px)); }
      }
      .bt-glossary-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 4px;
      }
      .bt-glossary-eyebrow {
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: var(--accent);
      }
      .bt-glossary-close {
        width: 24px;
        height: 24px;
        border-radius: 6px;
        border: 1px solid var(--line);
        background: transparent;
        color: var(--text-3);
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: all 140ms ease;
      }
      .bt-glossary-close:hover {
        color: var(--text);
        border-color: var(--line-2);
        background: rgba(255,255,255,0.04);
      }
      .bt-glossary-term-title {
        font-family: 'Instrument Serif', 'Geist', serif;
        font-size: 22px;
        font-weight: 400;
        line-height: 1.1;
        margin: 2px 0 8px;
        color: var(--text);
        letter-spacing: -0.015em;
        animation: btGlossarySwap 220ms cubic-bezier(0.2, 0.9, 0.3, 1);
      }
      .bt-glossary-also {
        font-size: 10.5px;
        color: var(--text-3);
        margin: -4px 0 10px;
        font-style: italic;
        letter-spacing: 0.01em;
        animation: btGlossarySwap 220ms cubic-bezier(0.2, 0.9, 0.3, 1);
      }
      .bt-glossary-also-label {
        font-style: normal;
        font-weight: 600;
        text-transform: uppercase;
        font-size: 9px;
        letter-spacing: 0.12em;
        color: var(--text-4);
        margin-right: 4px;
      }
      .bt-glossary-def {
        font-size: 13px;
        line-height: 1.6;
        color: var(--text-2);
        margin: 0 0 12px;
        animation: btGlossarySwap 220ms cubic-bezier(0.2, 0.9, 0.3, 1);
      }
      @keyframes btGlossarySwap {
        from { opacity: 0; transform: translateY(4px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .bt-glossary-wiki {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 11px;
        margin: 0 0 12px;
        border-radius: 8px;
        border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
        background: color-mix(in srgb, var(--accent) 6%, transparent);
        color: var(--accent);
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.02em;
        text-decoration: none;
        transition: all 160ms cubic-bezier(0.2, 0.9, 0.3, 1);
      }
      .bt-glossary-wiki:hover {
        background: color-mix(in srgb, var(--accent) 16%, transparent);
        border-color: color-mix(in srgb, var(--accent) 60%, transparent);
        transform: translateY(-1px);
      }
      .bt-glossary-wiki:hover svg { transform: translate(1px, -1px); }
      .bt-glossary-wiki svg { transition: transform 160ms ease; }
      .bt-glossary-wiki:focus-visible {
        outline: 2px solid var(--accent);
        outline-offset: 2px;
      }

      /* ─── Reader Wikipedia link (in top meta row) ─── */
      .bt-reader-wiki {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 3px 9px 3px 9px;
        border-radius: 999px;
        border: 1px solid var(--line);
        background: rgba(255, 255, 255, 0.02);
        color: var(--text-3);
        font-size: 10.5px;
        font-weight: 500;
        letter-spacing: 0.02em;
        text-decoration: none;
        transition: all 160ms cubic-bezier(0.2, 0.9, 0.3, 1);
      }
      .bt-reader-wiki:hover {
        color: var(--accent);
        border-color: color-mix(in srgb, var(--accent) 55%, transparent);
        background: color-mix(in srgb, var(--accent) 8%, transparent);
      }
      .bt-reader-wiki:hover svg { transform: translate(1px, -1px); }
      .bt-reader-wiki svg { transition: transform 160ms ease; color: currentColor; }
      .bt-reader-wiki:focus-visible {
        outline: 2px solid var(--accent);
        outline-offset: 2px;
      }

      /* ─── Canon tradition badges ─── */
      .bt-reader-canons {
        display: flex;
        gap: 4px;
        flex-wrap: wrap;
        margin-left: 4px;
      }
      .bt-canon-badge {
        font-size: 8.5px;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        padding: 2px 7px;
        border-radius: 4px;
        border: 1px solid;
        white-space: nowrap;
      }
      .bt-canon-jewish {
        color: #F5A524;
        background: rgba(245, 165, 36, 0.1);
        border-color: rgba(245, 165, 36, 0.28);
      }
      .bt-canon-protestant {
        color: #60A5FA;
        background: rgba(96, 165, 250, 0.1);
        border-color: rgba(96, 165, 250, 0.28);
      }
      .bt-canon-catholic {
        color: #FB7185;
        background: rgba(251, 113, 133, 0.1);
        border-color: rgba(251, 113, 133, 0.28);
      }
      .bt-canon-orthodox {
        color: #C084FC;
        background: rgba(192, 132, 252, 0.1);
        border-color: rgba(192, 132, 252, 0.28);
      }

      .bt-glossary-related {
        padding-top: 10px;
        border-top: 1px solid var(--line);
      }
      .bt-glossary-related-label {
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--text-3);
        margin-bottom: 7px;
      }
      .bt-glossary-related-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
      }
      .bt-glossary-related-chip {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 4px 9px;
        border-radius: 999px;
        border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
        background: color-mix(in srgb, var(--accent) 6%, transparent);
        color: var(--text-2);
        font-size: 11px;
        font-weight: 500;
        font-family: inherit;
        cursor: pointer;
        transition: all 140ms ease;
      }
      .bt-glossary-related-chip:hover {
        color: var(--accent);
        border-color: color-mix(in srgb, var(--accent) 65%, transparent);
        background: color-mix(in srgb, var(--accent) 14%, transparent);
        transform: translateY(-1px);
      }
      .bt-glossary-related-chip svg {
        color: var(--text-4);
        transition: all 140ms ease;
      }
      .bt-glossary-related-chip:hover svg {
        color: var(--accent);
        transform: translateX(1px);
      }
      .bt-glossary-related-chip:focus-visible {
        outline: 2px solid var(--accent);
        outline-offset: 2px;
      }
      .bt-tip-item {
        display: flex;
        align-items: center;
        gap: 7px;
        font-size: 11px;
        color: var(--text-2);
      }
      .bt-tip-item-dot {
        width: 5px; height: 5px;
        border-radius: 50%;
        flex-shrink: 0;
      }
      .bt-tip-item-label {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      /* ─── READER (integrated panel) ─── */
      .bt-reader {
        flex-shrink: 0;
        height: 340px;
        position: relative;
        background:
          linear-gradient(180deg, rgba(20, 20, 24, 0.92), rgba(12, 12, 14, 0.96));
        border-top: 1px solid var(--line-2);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        animation: btReaderIn 420ms cubic-bezier(0.2, 0.9, 0.3, 1);
        backdrop-filter: blur(16px);
      }
      @keyframes btReaderIn {
        from { transform: translateY(40px); opacity: 0; }
        to   { transform: translateY(0);     opacity: 1; }
      }
      .bt-reader-accent {
        position: absolute; top: 0; left: 0; right: 0;
        height: 1px;
        opacity: 0.8;
        pointer-events: none;
      }
      .bt-reader-top {
        flex-shrink: 0;
        padding: 14px 24px 12px;
        display: flex;
        align-items: center;
        gap: 14px;
        border-bottom: 1px solid var(--line);
      }
      .bt-reader-meta { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; flex-wrap: wrap; }
      .bt-reader-chip {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 11px 4px 8px;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        border-radius: 999px;
        border: 1px solid;
        background: rgba(255,255,255,0.02);
      }
      .bt-reader-dot {
        width: 6px; height: 6px;
        border-radius: 50%;
      }
      .bt-reader-year {
        font-family: 'Geist Mono', monospace;
        font-size: 12px;
        color: var(--text-3);
        font-variant-numeric: tabular-nums;
        letter-spacing: 0.02em;
      }
      .bt-reader-counter {
        font-family: 'Geist Mono', monospace;
        font-size: 12px;
        letter-spacing: 0.04em;
        color: var(--text-3);
        padding: 4px 10px;
        border-radius: 6px;
        background: rgba(255,255,255,0.025);
        border: 1px solid var(--line);
      }
      .bt-reader-idx { color: var(--text); font-weight: 600; }
      .bt-reader-sep { margin: 0 3px; color: var(--text-4); }
      .bt-reader-tot { color: var(--text-3); }
      .bt-reader-solo {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 5px 11px 5px 9px;
        border-radius: 7px;
        border: 1px solid var(--line);
        background: rgba(255,255,255,0.02);
        color: var(--text-3);
        font-size: 10.5px;
        font-weight: 600;
        letter-spacing: 0.02em;
        cursor: pointer;
        font-family: inherit;
        transition: all 160ms cubic-bezier(0.2, 0.9, 0.3, 1);
        white-space: nowrap;
      }
      .bt-reader-solo:hover {
        color: var(--accent);
        border-color: color-mix(in srgb, var(--accent) 50%, transparent);
        background: color-mix(in srgb, var(--accent) 8%, transparent);
      }
      .bt-reader-solo.active {
        color: var(--accent);
        border-color: color-mix(in srgb, var(--accent) 55%, transparent);
        background: color-mix(in srgb, var(--accent) 14%, transparent);
        box-shadow: 0 0 12px color-mix(in srgb, var(--accent) 20%, transparent);
      }
      .bt-reader-solo:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

      .bt-close {
        width: 30px; height: 30px;
        border-radius: 8px;
        border: 1px solid var(--line);
        background: transparent;
        color: var(--text-3);
        cursor: pointer;
        display: inline-flex; align-items: center; justify-content: center;
        flex-shrink: 0;
        transition: all 140ms ease;
      }
      .bt-close:hover { color: var(--text); border-color: var(--line-2); background: rgba(255,255,255,0.04); }

      .bt-reader-body {
        flex: 1;
        min-height: 0;
        display: flex;
        align-items: stretch;
      }
      .bt-reader-nav {
        width: 76px;
        flex-shrink: 0;
        background: transparent;
        border: none;
        border-right: 1px solid var(--line);
        color: var(--text-3);
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 6px;
        font-family: inherit;
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        transition: all 200ms cubic-bezier(0.2, 0.9, 0.3, 1);
      }
      .bt-reader-next { border-right: none; border-left: 1px solid var(--line); }
      .bt-reader-nav:hover:not(:disabled) {
        color: var(--accent);
        background: rgba(245, 165, 36, 0.05);
      }
      .bt-reader-nav:hover:not(:disabled) svg {
        transform: scale(1.15);
      }
      .bt-reader-nav svg { transition: transform 200ms cubic-bezier(0.2, 0.9, 0.3, 1); }
      .bt-reader-prev:hover:not(:disabled) svg { transform: translateX(-2px) scale(1.15); }
      .bt-reader-next:hover:not(:disabled) svg { transform: translateX(2px) scale(1.15); }
      .bt-reader-nav:disabled {
        color: var(--text-4);
        opacity: 0.35;
        cursor: not-allowed;
      }
      .bt-reader-nav:focus-visible { outline: 2px solid var(--accent); outline-offset: -4px; }

      .bt-reader-content {
        flex: 1;
        padding: 18px 28px 22px;
        overflow-y: auto;
        min-width: 0;
      }
      .bt-reader-title {
        font-family: 'Instrument Serif', 'Geist', serif;
        font-size: 32px;
        font-weight: 400;
        line-height: 1.05;
        margin: 0 0 8px;
        color: var(--text);
        letter-spacing: -0.02em;
      }
      .bt-reader-detail {
        font-size: 14px;
        line-height: 1.65;
        color: var(--text-2);
        margin: 0 0 16px;
        max-width: 72ch;
      }
      .bt-reader-fields {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 14px 20px;
        padding: 16px 0;
        margin: 16px 0;
        border-top: 1px solid var(--line);
        border-bottom: 1px solid var(--line);
      }
      .bt-field-key {
        font-size: 9px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.14em;
        margin-bottom: 3px;
      }
      .bt-field-val {
        font-size: 12.5px;
        line-height: 1.55;
        color: var(--text-2);
      }

      /* ─── Reader extended sections ─── */
      .bt-reader-quote {
        margin: 16px 0 18px;
        padding: 2px 0 2px 16px;
        border-left: 2px solid;
        font-family: 'Instrument Serif', 'Geist', serif;
        font-size: 18px;
        line-height: 1.35;
        font-style: italic;
        color: var(--text);
        letter-spacing: -0.01em;
        max-width: 64ch;
      }
      .bt-reader-section {
        margin: 16px 0;
      }
      .bt-reader-section-label {
        font-size: 9px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.14em;
        margin-bottom: 6px;
      }
      .bt-reader-section-body {
        font-size: 13.5px;
        line-height: 1.6;
        color: var(--text-2);
        margin: 0;
        max-width: 72ch;
      }
      .bt-reader-sources {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-wrap: wrap;
        gap: 6px 8px;
      }
      .bt-reader-sources li {
        font-size: 11.5px;
        color: var(--text-3);
        padding: 4px 10px;
        border-radius: 6px;
        background: rgba(255,255,255,0.025);
        border: 1px solid var(--line);
        font-feature-settings: "ss01";
      }
      .bt-reader-related {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .bt-reader-related-chip {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        padding: 6px 10px 6px 9px;
        border-radius: 999px;
        border: 1px solid color-mix(in srgb, var(--rc) 35%, transparent);
        background: color-mix(in srgb, var(--rc) 6%, transparent);
        color: var(--text-2);
        font-size: 11.5px;
        font-weight: 500;
        font-family: inherit;
        cursor: pointer;
        transition: all 160ms cubic-bezier(0.2, 0.9, 0.3, 1);
      }
      .bt-reader-related-chip:hover {
        color: var(--text);
        border-color: color-mix(in srgb, var(--rc) 70%, transparent);
        background: color-mix(in srgb, var(--rc) 14%, transparent);
        transform: translateY(-1px);
      }
      .bt-reader-related-chip:focus-visible { outline: 2px solid var(--rc); outline-offset: 2px; }
      .bt-reader-related-chip svg { color: var(--text-3); }
      .bt-reader-related-chip:hover svg { color: var(--rc); transform: translateX(1px); }
      .bt-reader-related-chip svg { transition: all 160ms ease; }
      .bt-reader-related-dot {
        width: 6px; height: 6px;
        border-radius: 50%;
        flex-shrink: 0;
      }

      .bt-btn {
        padding: 8px 14px;
        border-radius: 8px;
        border: 1px solid var(--line-2);
        background: rgba(255,255,255,0.03);
        color: var(--text);
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        transition: all 160ms ease;
      }
      .bt-btn:hover { background: rgba(255,255,255,0.07); }

      /* ─── Mobile ─── */
      @media (max-width: 720px) {
        .bt-header { padding: 12px 16px; gap: 12px; flex-wrap: wrap; }
        .bt-brand-name { font-size: 18px; }
        .bt-brand-sub { font-size: 10px; }
        .bt-mark { width: 32px; height: 32px; }
        .bt-nav-host { padding: 10px 14px 12px; }
        .bt-nav-meta { font-size: 10px; flex-wrap: wrap; gap: 8px; }
        .bt-reader { height: 380px; }
        .bt-reader-title { font-size: 24px; }
        .bt-reader-quote { font-size: 15px; }
        .bt-reader-top { padding: 12px 16px 10px; }
        .bt-reader-nav { width: 56px; }
        .bt-reader-nav-label { display: none; }
        .bt-reader-content { padding: 14px 18px 18px; }
        .bt-nav-hint { display: none; }
        .bt-fp-head { padding: 10px 16px; }
        .bt-fp-body { padding: 10px 16px 14px; max-height: 280px; }
        .bt-fp-chip-btn { font-size: 10px; padding: 4px 6px; }
        .bt-header-count { display: none; }
      }

      @media (prefers-reduced-motion: reduce) {
        .bt-reader, .bt-tip, .bt-fp { animation: none; }
        .bt-chip, .bt-event g, .bt-btn-icon, .bt-reader-nav svg { transition: none; }
      }
    `}</style>
  );
}
