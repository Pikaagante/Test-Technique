import json

with open("blocs.json", "r", encoding="utf-8") as fichier:
    donnees = json.load(fichier)
    
for bloc in donnees["blocs"]:
    groupes_phrases = []
    max_len = 0

    for phrase in bloc["phrases"]:
        if phrase.lower() == "cette phrase ne doit pas être affichée":
            continue
        
        if not phrase.strip():
            continue
        
        phrase = phrase.lower()
        
        # découper les phrases
        while len(phrase) > 96:
            position = phrase[:96].rfind(" ")
            
            if position == -1:
                position = 96

            groupes_phrases.append(phrase[:position])
            phrase = phrase[position + 1:]
            
        groupes_phrases.append(phrase)
        
    max_len = max(map(len, groupes_phrases), default=0)

    if not groupes_phrases:
        continue
              
    print("-" * (max_len + 4))

    for phrase in groupes_phrases:
        print("| " + phrase.center(max_len) + " |")

    print("-" * (max_len + 4))