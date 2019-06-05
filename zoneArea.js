class ZoneArea{
    constructor(){
        this.mobilite = [];
        this.cellules=[];
        this.compatibilite=[]
    }
    fillMobiliteTableRand() {
        for (let i = 0; i < this.cellules.length; i++) {
            this.mobilite.push(Array());
            for (let j = 0; j < this.cellules[i].length; j++) {
                this.mobilite[i].push(Array());
                for (let k = 0; k < 4; k++) { //4 directions for now
                    this.mobilite[i][j].push(Math.floor(Math.random() * Math.floor(100)));
                }
            }
        }
    }

    calculateLa2(nbantennes, nbZoneMin, nbZoneMax){
        this.fillMobiliteTableRand();

        for (let i = 0; i < nbantennes; i++) {
            this.compatibilite.push(Array());
            for (let j = 0; j < nbantennes; j++) {
                this.compatibilite[i].push(0);

            }
        }
        if (nbantennes === nbZoneMin && nbantennes === nbZoneMax){
            //Une zone par cellule(antenne)
        }
        console.log(this.mobilite.length);
        for(let x = 0;x<this.cellules.length;x++) {
            for (let y = 0; y < this.cellules[x].length; y++) {
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
        for(let a = 0; a< this.compatibilite.length;a++){
            s = "[";
            for(let b =0 ;b<this.compatibilite[a].length;b++){
                s+=this.compatibilite[a][b]+",";
            }

            console.log(s+"]");
        }
        //La compatibilité inter antenne est caclulée il faut maintenant coupler les antennes
    }
    printcellules(){

        for (let i = 0; i < this.cellules.length; i++) {
            s="Cellule [";
            for (let j = 0; j <this.cellules[i].length; j++) {
                s+=this.cellules[i][j]+",";
            }
            console.log(s+"]");
        }
    }
}