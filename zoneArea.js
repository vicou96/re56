class ZoneArea{
  
    constructor(){
        this.mobilite = [];
        this.cellules=[];
        this.compatibilite=[]
    }

    fillMobiliteTableRand() {
        for (let i = 0; i < this.mobilite.length; i++) {
            for (let j = 0; j < this.mobilite[i].length; j++) {
                for (let k = 0; k < this.mobilite[i][j].length; k++) {
                    this.mobilite[i][j][k] = 1;
                }
            }
        }
    }

    calculateLa2(nbantennes, nbZoneMin, nbZoneMax){
        this.fillMobiliteTableRand();
        console.log(this.mobilite[0][0][0]);

        this.compatibilite = Array(nbantennes).fill(Array(nbantennes).fill(0));
        if (nbantennes === nbZoneMin && nbantennes === nbZoneMax){
            //Une zone par cellule(antenne)
        }
        console.log(this.mobilite.length);
        for(let x = 0;x<this.cellules.length;x++) {
            s = "Maillage [";
            for (let y = 0; y < this.cellules[x].length; y++) {
                s += this.cellules[x][y]+",";
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
            console.log(s+"]");
        }
        console.log(this.compatibilite.length);
        console.log(this.compatibilite[0].length);
        for(let a = 0; a< this.compatibilite.length;a++){
            s = "[";
            for(let b =0 ;b<this.compatibilite[a].length;b++){
                s+=this.compatibilite[a][b]+",";
            }

            console.log(s+"]");
        }
        //La compatibilité inter antenne est caclulée il faut maintenant coupler les antennes
    }
}
