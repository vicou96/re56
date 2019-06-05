class ZoneArea{
    constructor(){
        this.mobilite = [];
        this.cellules=[];
        this.compatibilite=[]
    }
    fillMobiliteTableRand(mobilite) {
        this.mobilite.forEach(function(array2) {
            array2.forEach(function (array3) {
                array3.forEach(function (elem) {
                    elem = 1;
                });
            });
        });
    }

    calculateLa(nbantennes, nbZoneMin, nbZoneMax){
        this.compatibilite = Array(nbantennes).fill(Array(nbantennes-1).fill(0));
        nbZoneMin = parseInt(document.getElementById('minLa').value);
        nbZoneMax = parseInt(document.getElementById('maxLa').value);
        if (nbantennes === nbZoneMin && nbantennes === nbZoneMax){
            //Une zone par cellule(antenne)
        }

/*                 mobilite[0]
        mobilite[1] cellule mobilite[2]
                   mobilite[3]
 */
        for(let i = 0;i<nbantennes;i++){
            for(let j=0;j<nbantennes;j++){
                if(i==j){
                    continue;
                }else{
                    for(let x = 0;x<this.cellules.length;x++){
                        for(let y = 0 ; y<this.cellules.length;y++){
                            if(this.cellules[x][y] === i){ // Si la cellule appartient a l'entenne recherchée
                                if (this.mobilite[x][y].length === 4){ //Pour l'instant, on aura au maximum 4 adjacent, à voir par la suite pour en avoir 8, est-ce que c'est mieux???
                                    if (this.cellules[x-1][y] === j){ //Si la cellule du dessus appartient a l'antenne target
                                        //Ajouter la mobilité 0 dans la fréquence (Cette maille est adjacente a celle d'une autre cellule)
                                        this.compatibilite[i][j] += mobilite[x][y];
                                    }
                                }
                            }else {
                                continue;
                            }
                        }
                    }


                }
            }
        }
    }


    calculateLa2(nbantennes, nbZoneMin, nbZoneMax){
        this.compatibilite = Array(nbantennes).fill(Array(nbantennes).fill(0));
        nbZoneMin = parseInt(document.getElementById('minLa').value);
        nbZoneMax = parseInt(document.getElementById('maxLa').value);
        if (nbantennes === nbZoneMin && nbantennes === nbZoneMax){
            //Une zone par cellule(antenne)
        }
        console.log(this.cellules.length);
        for(let x = 0;x<this.cellules.length;x++) {
            for (let y = 0; y < this.cellules.length; y++) {
                let currentAntenna = this.cellules[x][y];
                if(x!==0 && currentAntenna!==this.cellules[x-1][y]){ // HAUT
                    this.compatibilite[currentAntenna][this.cellules[x-1][y]]+=this.mobilite[x][y][0];
                }

                if(y!==0 && currentAntenna!==this.cellules[x][y-1]){ // GAUCHE
                    this.compatibilite[currentAntenna][this.cellules[x][y-1]]+=this.mobilite[x][y][1];
                }

                if(y!==this.cellules[x].length-1 && currentAntenna!==this.cellules[x][y+1]){ // DROIT
                    this.compatibilite[currentAntenna][this.cellules[x][y+1]]+=this.mobilite[x][y][2];
                }

                if(x!==this.cellules.length-1 && currentAntenna!==this.cellules[x+1][y]){ // BAS
                    this.compatibilite[currentAntenna][this.cellules[x+1][y]]+=this.mobilite[x][y][3];
                }
            }
        }
        console.log(this.compatibilite.length);
        console.log(this.compatibilite[0].length);
        for(let elem in this.compatibilite){
            s = "[";
            for(let probba in elem){
                console.log(probba);
                s+=probba+",";
            }

            console.log(s+"]");
        }
        //La compatibilité inter antenne est caclulée il faut maintenant coupler les antennes
    }
}