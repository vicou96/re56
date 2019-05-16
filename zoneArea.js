class ZoneArea{
    constructor(){
        this.mobilite = [];
        this.cellules=[];
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

        nbZoneMin = parseInt(document.getElementById('minLa').value);
        nbZoneMax = parseInt(document.getElementById('maxLa').value);
        if (nbantennes == nbZoneMin && nbantennes == nbZoneMax){
            //Une zone par cellule(antenne)
        }


        for(let i = 0;i<nbantennes;i++){
            for(let j=0;j<nbantennes;j++){
                if(i==j){
                    continue;
                }else{
                    for(let x = 0;x<this.cellules.length;x++){
                        for(let y = 0 ; y<this.cellules.length;y++){
                            if(this.cellules[x][y] == i+1){
                                if (this.mobilite[x][y].length == 4){ //Pour l'instant, on aura au maximum 4 adjacent, à voir par la suite pour en avoir 8, est-ce que c'est mieux???
                                    if (this.cellules[x-1][y] == j+1){
                                        //Ajouter la mobilité 0 dans la fréquence (Cette maille est adjacente a celle d'une autre cellule)
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
}