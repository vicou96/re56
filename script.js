
//Input Data
//The deployment are is subdivided into blocks
var largZone=3; //Number of column blocks
var hautZone=3; //Number of line blocks
var bl=0;   	//counter of block line (during scanning)
var bc=0;		//counter of block column (during scanning)
var coinSud;	//the south-East side of the deployment area
var bloc;		//current scanned block
var lngBloc; 	//Lng width of a block
var latBloc;	//Lat height of a block
var pdm=20;		//Number of bins if a block = pdm x pdm
var latBin; 	//Lat size of a bin (about 10metres)
var lngBin;		//Lng size a bin (about 10metres)

var size;
var xx,yy;
var chaine="";

var elevations;
var relief = [];    	//elevation of the natural landscape
var architecture = [];	//elevation of the buildings
var elevation=[];		//the total elevation of natural landscape and buildings


var antenne;
var CCost=0;
var carto=false;
var a;
var angleindex;

var firstpropag=true //the relief table should be normalized at the beginning
function Antenne(location, omni, tilt, azimut, puiss)
{
    this.location=location; //position of the antenna
    this.omni=omni;			//omni or not
    this.azimut=azimut;		//azimuth in radian
    this.puissance=puiss;	//power inn Db
    this.tilt=tilt;			//tilt in radian
}
var antennes=[];
var nbantennes=0;
var bins=[];
var blocs=[];
var selectcoin;
var VertRadiationPattern = [
    0, -4, -8, -12, -15, -17, -18, -19, -20, -23, -26, -28, -30, -31, -31, -30, -27, -23, -18, -23, -27, -31, -33, -34, -33, -31, -29, -26, -23, -20, -18, -19, -20, -19, -19, -18, -18, -18, -19, -19, -20, -19, -18, -20, -23, -26, -29, -31, -33, -34, -33, -31, -27, -23, -18, -23, -27, -30, -31, -31, -30, -28, -26, -23, -20, -19, -18, -17, -15, -12, -8, -4, 0
];
var HorzRadiationPattern = [
    0, -4, -8, -12, -15, -17, -18, -19, -20, -23, -26, -28, -30, -31, -31, -30, -27, -23, -18, -23, -27, -31, -33, -34, -33, -31, -29, -26, -23, -20, -18, -19, -20, -19, -19, -18, -18, -18, -19, -19, -20, -19, -18, -20, -23, -26, -29, -31, -33, -34, -33, -31, -27, -23, -18, -23, -27, -30, -31, -31, -30, -28, -26, -23, -20, -19, -18, -17, -15, -12, -8, -4, 0
];
var group1 = L.featureGroup();
var modeclick=0;
//variables locales
var omni;
var i,j;
var cst1;
var cst2;
var hpoint;
var delta;
var alpha;
var angle,ti,az;
var p1,p2;
var idist, jdist;
var jpas;
var ipas;
var sobstacle;
var s;
var iobstacle;
var jobstacle;
var hmax;
var dobs;
var hvmax;
var hant;
var point;
var d1;
var d2;
var R1;
var v;
var LKE;
var LFS;
var L;
var bin = [];

var bande,seuil;

var ant;
var circle;
var couvertureCell = [];

var axes = [];
var largaxes=[];
var estSurRoute=[];
var orientation=[];

var puissance=[];

var zonearea = new ZoneArea();
var cellules=[];
var LA=[];
var mobilite=[];

var colors=[];

var start;

//action after the selection of the south-east corner of the covering area
function placeCoin(location) {
    coinSud=location;
    bloc=location;
    var p3=L.latLng(bloc.lat+0.001, bloc.lng);
    var distance=L.GeometryUtil.length([location, p3]);

    latBin=0.001*10/distance;

    p3=L.latLng(bloc.lat, bloc.lng+0.001);
    var distance=L.GeometryUtil.length([location, p3]);
    lngBin=0.001*10/distance;

    lngBloc=lngBin*pdm; //size of a block  (in longitude)
    latBloc=latBin*pdm;	//the same for the latitude

    document.getElementById('message').value = "Scan en cours !!!";
    largZone=parseInt(document.getElementById('largZone').value);
    hautZone=parseInt(document.getElementById('hautZone').value);
    document.getElementById('largZone').disabled='disabled';
    document.getElementById('hautZone').disabled='disabled';
    for(i=0;i<pdm*hautZone;i++){
        relief.push([]);
        for(j=0;j<largZone*pdm;j++) relief[i].push(0);
    }
    for(i=0;i<pdm*hautZone;i++){
        elevation.push([]);
        for(j=0;j<largZone*pdm;j++) elevation[i].push(0);
    }
    for(i=0;i<pdm*hautZone;i++){
        architecture.push([]);
        for(j=0;j<largZone*pdm;j++) architecture[i].push(0);
    }
    for(i=0;i<pdm*hautZone;i++){
        couvertureCell.push([]);
        for(j=0;j<largZone*pdm;j++) couvertureCell[i].push(-1);
    }
    for(i=0;i<pdm*hautZone;i++){
        estSurRoute.push([]);
        for(j=0;j<largZone*pdm;j++) {estSurRoute[i].push([]);estSurRoute[i][j]=false;}
    }
    orientation=[];
    for(i=0;i<pdm*hautZone;i++){
        orientation.push([]);
        for(j=0;j<largZone*pdm;j++){
            orientation[i].push([]);
            orientation[i][j]=-1;
        }
    }

    drawPath();
}
function degriser(){
    document.getElementById('btn').disabled = '';
}
var addantenna;
var lignesvides=[];
var ligne;

function drawPath() {

    mymap.addLayer(group1);
    //mymap.addLayer(grmailles);
    //generation of random relief : waiting for leaflet API to get real data
    for(ligne=0;ligne<pdm;ligne++) //for each line in the current block
    {
        for(col=0;col<pdm;col++) //for each column in the current block
        {
            relief[bl*pdm+ligne][bc*pdm+col]=Math.floor(Math.random()*10);
        }
    }
    //display the scanned block
    var zonecontour = L.polygon([
        [bloc.lat, bloc.lng],
        [bloc.lat+latBin*pdm, bloc.lng],
        [bloc.lat+latBin*pdm, bloc.lng+lngBloc],
        [bloc.lat, bloc.lng+lngBloc]
    ]).addTo(group1);


    bc++;
    if(bc==largZone){
        bc=0;
        bl++;
        bloc=L.latLng(bloc.lat+latBin*pdm, coinSud.lng);
    }
    else{
        bloc=L.latLng(bloc.lat, bloc.lng+lngBloc);
    }
    //Fin du scan de la zone étudiée
    if(bl==hautZone) {
        document.getElementById('propag').disabled = '';
        document.getElementById('routes').disabled = '';
        document.getElementById('completer').disabled = '';
        document.getElementById('axes').disabled = '';
        document.getElementById('antenne').disabled = '';
        document.getElementById('batiment').disabled = '';
        document.getElementById('saveBat').disabled = '';
        document.getElementById('loadBat').disabled = '';
        document.getElementById('ecole').disabled = '';

        mymap.removeLayer(group1);
        // Display the deployment area
        var zonecontour = L.polygon([
            [coinSud.lat, coinSud.lng],
            [coinSud.lat+latBloc*hautZone, coinSud.lng],
            [coinSud.lat+latBloc*hautZone, coinSud.lng+lngBloc*largZone],
            [coinSud.lat, coinSud.lng+lngBloc*largZone]
        ]).addTo(mymap);

        document.getElementById('message').value = "Choisissez une action !";

        return;
    }
    //scan the next block
    setTimeout("drawPath()",10);
}

var markerantenna=[];
function placeAntenne(location,power,type,tilt,azimut) {
    antenne=new Antenne(location,true);

    //if the antenna is added by a mousse click
    if( typeof(type) == 'undefined' ){
        if(document.getElementById('omni').checked)
            omni = true;
        else omni=false;
        antenne.omni=omni;
        antenne.tilt = document.getElementById('tilt').value;
        if (antenne.tilt != null) {
            tilt=parseInt(antenne.tilt)*Math.PI/180;
            antenne.tilt=tilt;
        }
        else antenne.tilt=0;
        if(!omni){
            var az = document.getElementById('azimut').value;
            if (az != null) {
                azimut=parseInt(az)*Math.PI/180;
                antenne.azimut=azimut;
            }
            else antenne.azimut=0;
        }
        objpower=document.getElementById('power');
        antenne.puissance = parseInt(objpower.value);
    }
    //it is a restored antenna from stored data
    else {
        if(type=="omni"){
            omni=true;
            antenne.omni=omni;
            antenne.azimut=-1;
            antenne.tilt=tilt;
            antenne.puissance=power;
        }
        else{
            omni=false;
            antenne.omni=omni;
            antenne.azimut=azimut;
            antenne.tilt=tilt;
            antenne.puissance=power;
        }
    }
    //display the antenna
    //circle if it is an omni antenna
    if(	omni==true){
        var circle=L.circle([location.lat, location.lng], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 10
        }).addTo(mymap);
        // Add the circle for this city to the map.
        markerantenna.push(circle);
    }
    //a line if it is a directional antenna
    else{
        var arrow = L.polyline([
            location,
            L.latLng(location.lat+2*latBin*Math.sin(Math.PI/2-azimut), location.lng+2*lngBin*Math.cos(Math.PI/2-azimut))
        ],{weight: 1,color: 'red'}).addTo(mymap);
        var arrow = L.circle([location.lat, location.lng],{
            color : 'red',
            fillColor: '#f03',
            fillOpacity: 1,
            radius: 2}).addTo(mymap);
    }
    antennes.push(antenne);
    nbantennes++;
    //google.maps.event.removeListener(addantenna);
    document.getElementById('message').value = "Choisissez une action !";
    frameantenna.style.visibility='hidden';
}
//action when the radio propagation computing is required : click on the button
function propagation() {
    //avoid re-click on the button during the computation
    document.getElementById('propag').disable='disabled';
    //normalize the elevation data
    if(firstpropag==true)
    {
        firstpropag=false;
        min=10000;
        for(i=0;i<pdm*hautZone;i++)
            for(j=0;j<largZone*pdm;j++)
                if(relief[i][j]<min) min=relief[i][j];
        for(i=0;i<pdm*hautZone;i++)
            for(j=0;j<largZone*pdm;j++)
                relief[i][j]=relief[i][j]-min;
    }
    for(i=0;i<pdm*hautZone;i++){
        for(j=0;j<largZone*pdm;j++){
            elevation[i][j]=relief[i][j]+architecture[i][j];
        }
    }
    puissance=[];
    for(a=0;a<nbantennes;a++){
        puissance.push([]);
        for(i=0;i<pdm*hautZone;i++){
            puissance[a].push([]);
            for(j=0;j<largZone*pdm;j++){
                puissance[a][i].push([]);
                puissance[a][i][j]=-1000;
            }
        }
    }
    rep=document.getElementById('methode').value;
    if(document.getElementById('methode').value=="1") propagationSKE();
    else if(document.getElementById('methode').value=="2") propagationBull();
    else if(document.getElementById('methode').value=="8") propagationCostHata();
    else if(document.getElementById('methode').value=="9") propagationWalfisch();
    document.getElementById('cartepuissance').disabled='';
    document.getElementById('carteinterference').disabled='';
    document.getElementById('cartehandover').disabled='';
    document.getElementById('cartecellule').disabled='';
    document.getElementById('carteresidence').disabled='';
    document.getElementById('propag').disable='';
}

function GetColor(p) {

    /*index=parseInt((50-p)*520/(50-seuil));
    r=colors[index][0];
    v=colors[index][1];
    b=colors[index][2];*/
    if(p>0) {
        r=251;v=0;b=0;
    }
    else if(p>-50) {r=250;v=123;b=0;}
    else if(p>-70) {r=251;v=220;b=0;}
    else if(p>-80) {r=244;v=251;b=0;}
    else if(p>-90) {r=188;v=251;b=0;}
    else if(p>-100) {r=1;v=250;b=57;}
    else if(p>-105) {r=0;v=251;b=201;}
    else if(p>-110) {r=0;v=207;b=251;}
    else if(p>-115) {r=1;v=69;b=250;}
    else {r=51;v=1;b=250;}

    if(r<16)strred="0"+r.toString(16); else strred=r.toString(16);
    if(b<16)strblue="0"+b.toString(16); else strblue=b.toString(16);
    if(v<16)strgreen="0"+v.toString(16); else strgreen=v.toString(16);
    return "#"+strred+strgreen+strblue;
}


function propagationCostHata(){
    var p1= L.latLng(bloc.lat, bloc.lng);
    var p2= L.latLng(bloc.lat+latBloc, bloc.lng);
    var hautBin=L.GeometryUtil.length([p1, p2])/pdm;
    p1= L.latLng(bloc.lat, bloc.lng);
    p2= L.latLng(bloc.lat, bloc.lng+lngBloc);
    var largBin=L.GeometryUtil.length([p1, p2])/pdm;

    seuil=parseInt(document.getElementById('seuil').value);
    bande=parseInt(document.getElementById('bande').value);
    cst1=1.56*Math.log10(bande)+0.8;
    cst2=46.3 + 33.9*Math.log10(bande);

    for(a=0;a<nbantennes;a++){
        antenna=antennes[a].location;
        point=L.latLng(antenna.lat,antenna.lng);
        tilt=antennes[a].tilt;
        tilt=180*tilt/Math.PI;
        if(antennes[a].omni==false){
            azimut=antennes[a].azimut;
            azimut=180*azimut/Math.PI;
        }
        iant=Math.floor((antenna.lat-coinSud.lat)/latBin);
        jant=Math.floor((antenna.lng-coinSud.lng)/lngBin);
        hant=elevation[iant][jant]+10;
        if(-200<-iant) iinf=-iant;else iinf=-200;
        if(-200<-jant) jinf=-jant;else jinf=-200;
        if(200>pdm*hautZone-iant) isup=pdm*hautZone-iant;else isup=200;
        if(200>pdm*largZone-jant) jsup=pdm*largZone-jant;else jsup=200;

        for(jdist=jinf;jdist<=jsup;jdist++)
            for(idist=iinf;idist<=isup;idist++)
            {
                ipoint=iant+idist;					//coordonnées en maille d'un point de reception
                jpoint=jant+jdist;
                if(ipoint<0 || jpoint<0 || ipoint >= pdm*hautZone || jpoint>=pdm*largZone) continue;
                point.lat=antenna.lat+idist*latBin
                point.lng=antenna.lng+jdist*lngBin;
                d=L.GeometryUtil.length([antenna, point]);
                if(idist==0 && jdist==0) { 	//si c'est la position de l'antenne alors ignorer
                    Loss=0;
                }
                else{

                    hpoint=elevation[ipoint][jpoint]+1.5;
                    if(CCost==3) ahr=3.2*(Math.log10(11.75*hpoint))*(Math.log10(11.75*hpoint))-4.97;
                    else ahr=(1.1*Math.log10(bande)-0.7)*hpoint-cst1;

                    Loss=cst2-13.82*Math.log10(hant);
                    Loss=Loss-ahr+(44.9-6.55*Math.log10(hant))*Math.log10(d/1000.0)+CCost;

                    angle=180*Math.atan(Math.abs(hant-hpoint)/d)/Math.PI;

                    angle=Math.abs(tilt-angle);

                    angleindex=Math.floor(angle/5);
                    Loss=Loss+ CCost-VertRadiationPattern[angleindex];

                    if(antennes[a].omni==false){
                        if(idist==0 && jdist>0) angle=90;
                        else if(idist==0 && jdist<0) angle=270;
                        else {
                            angle=180*Math.atan(jdist/idist)/Math.PI;
                            if(idist<0)
                                angle=angle+180;
                            if(angle<0) angle=angle+360;
                        }
                        angle=Math.abs(angle-azimut);
                        angleindex=Math.floor(angle/5);
                        Loss=Loss-HorzRadiationPattern[angleindex];
                    }
                }
                puissance[a][ipoint][jpoint]=antennes[a].puissance-Loss;
            }
    }
    document.getElementById('cartepuissance').enabled='';
}
function propagationSKE() {
    var p1= L.latLng(bloc.lat, bloc.lng);
    var p2= L.latLng(bloc.lat+latBloc, bloc.lng);
    var hautBin=L.GeometryUtil.length([p1, p2])/pdm;
    p1= L.latLng(bloc.lat, bloc.lng);
    p2= L.latLng(bloc.lat, bloc.lng+lngBloc);
    var largBin=L.GeometryUtil.length([p1, p2])/pdm;

    for(a=0;a<nbantennes;a++){
        antenna=antennes[a].location;
        point=L.latLng(antenna.lat, antenna.lng);
        iant=Math.floor((antenna.lat-coinSud.lat)/latBin);
        jant=Math.floor((antenna.lng-coinSud.lng)/lngBin);
        hant=elevation[iant][jant]+10;
        seuil=parseInt(document.getElementById('seuil').value);
        bande=parseInt(document.getElementById('bande').value);
        tilt=antennes[a].tilt;
        tilt=180*tilt/Math.PI;
        if(antennes[a].omni==false){
            azimut=antennes[a].azimut;
            azimut=180*azimut/Math.PI;
        }
        if(-200<-iant) iinf=-iant;else iinf=-200;
        if(-200<-jant) jinf=-jant;else jinf=-200;
        if(200>pdm*hautZone-iant) isup=pdm*hautZone-iant;else isup=200;
        if(200>pdm*largZone-jant) jsup=pdm*largZone-jant;else jsup=200;
        for(var jdist=jinf;jdist<=jsup;jdist++)
            for(var idist=iinf;idist<=isup;idist++)
            {
                ipoint=iant+idist;					//coordonnées en maille d'un point de reception
                jpoint=jant+jdist;
                if(ipoint<0 || jpoint<0 || ipoint >= pdm*hautZone || jpoint>=pdm*largZone) continue;
                point.lat=antenna.lat+idist*latBin
                point.lng=antenna.lng+jdist*lngBin;
                d=L.GeometryUtil.length([antenna, point]);
                if(idist==0 && jdist==0) { 	//si c'est la position de l'antenne alors ignorer
                    Loss=32.4+20*Math.log10((Math.sqrt(largBin*largBin+hautBin*hautBin)/2)/bande)+20*Math.log10(bande);
                }
                else{

                    hpoint=elevation[ipoint][jpoint];
                    delta=hant-hpoint-1.5;

                    alpha;							//l'angle fait entre l'antenne, les latitudes et le point de reception
                    if(jdist!=0) {
                        alpha=Math.atan(idist/(jdist));
                        if(idist<0 && jdist<0)  alpha=alpha+3.14;
                        else if(idist>=0 && jdist<0) alpha=alpha+3.14;
                    }
                    else {
                        if(idist>0) alpha=1.5707;
                        else alpha=-1.5707;
                    }


                    jpas=Math.cos(alpha); 			//pas d'avance sur la ligne directe entre l'antenne et le point de reception
                    ipas=Math.sin(alpha);
                    distPasBin=Math.sqrt(ipas*ipas*hautBin*hautBin+jpas*jpas*largBin*largBin);
                    iobstacle=Math.floor(iant+ipas);	//premier obstacle
                    jobstacle=Math.floor(jant+jpas);

                    hmax=elevation[iobstacle][jobstacle];	//hauteur du 1er obstacle
                    dobs=distPasBin;
                    hvmax=hant-(dobs/d)*delta;
                    sobstacle=1;
                    for(s=1;Math.abs(s*ipas)<Math.abs(idist);s++){	//parcours des obstacle avec un pas ipas, jpas
                        dobs=s*distPasBin;
                        hv=hant-(dobs/d)*delta;

                        if(elevation[Math.floor(iant+s*ipas)][Math.floor(jant+s*jpas)]-hv>hmax-hvmax){ 			//si c'est l'obstacle le plus haut
                            hmax=elevation[Math.floor(iant+s*ipas)][Math.floor(jant+s*jpas)];	//alors le stocker
                            hvmax=hv;
                            iobstacle=Math.floor(iant+s*ipas);
                            jobstacle=Math.floor(jant+s*jpas);
                            sobstcale=s;
                        }
                    }


                    LKE=0.0;
                    hmax=hmax-hvmax;

                    if(hmax>0){
                        obstacle=L.latLng(antenna.lat+sobstacle*ipas*latBin, antenna.lng+sobstacle*jpas*lngBloc/pdm);
                        d1=L.GeometryUtil.length([antenna, obstacle]);
                        d2=L.GeometryUtil.length([point,obstacle]);
                        R1=Math.sqrt(0.3*d1*d2/(d1+d2));
                        v=hmax*Math.sqrt(2)/R1;
                        if(v>1) LKE=-20*Math.log10(0.225/v);
                    }
                    if(LKE<0) LKE=0.0;
                    LFS=32.4+20*Math.log10((d)/1000.0)+20*Math.log10(bande);

                    Loss=LKE+LFS
                    angle=180*Math.atan(Math.abs(hant-hpoint)/d)/Math.PI;

                    angle=tilt-angle;
                    if(angle<0)	angle=360+angle;
                    angleindex=Math.floor(angle/5);
                    Loss=Loss+ CCost-VertRadiationPattern[angleindex];

                    if(antennes[a].omni==false){
                        if(idist==0 && jdist>0) angle=90;
                        else if(idist==0 && jdist<0) angle=270;
                        else {
                            angle=180*Math.atan(jdist/idist)/Math.PI;
                            if(idist<0)
                                angle=angle+180;
                            if(angle<0) angle=angle+360;
                        }
                        angle=Math.abs(angle-azimut);
                        angleindex=Math.floor(angle/5);
                        Loss=Loss-HorzRadiationPattern[angleindex];
                    }
                }
                puissance[a][ipoint][jpoint]=antennes[a].puissance-Loss;
            }
    }
    document.getElementById('cartepuissance').enabled='';
}
function propagationBull() {
    var p1= L.latLng(bloc.lat, bloc.lng);
    var p2= L.latLng(bloc.lat+latBloc, bloc.lng);
    var hautBin=L.GeometryUtil.length([p1, p2])/pdm;
    p1= L.latLng(bloc.lat, bloc.lng);
    p2= L.latLng(bloc.lat, bloc.lng+lngBloc);
    var largBin=L.GeometryUtil.length([p1, p2])/pdm;

    seuil=parseInt(document.getElementById('seuil').value);
    bande=parseInt(document.getElementById('bande').value);

    for(a=0;a<nbantennes;a++){
        antenna=antennes[a].location;
        point=L.latLng(antenna.lat, antenna.lng);
        iant=Math.floor((antenna.lat-coinSud.lat)/latBin);
        jant=Math.floor((antenna.lng-coinSud.lng)/lngBin);
        hant=elevation[iant][jant]+10;
        tilt=antennes[a].tilt;
        if(-200<-iant) iinf=-iant;else iinf=-200;
        if(-200<-jant) jinf=-jant;else jinf=-200;
        if(200>pdm*hautZone-iant) isup=pdm*hautZone-iant;else isup=200;
        if(200>pdm*largZone-jant) jsup=pdm*largZone-jant;else jsup=200;
        for(var jdist=jinf;jdist<=jsup;jdist++)
            for(var idist=iinf;idist<=isup;idist++)
            {

                if(idist==0 && jdist==0) continue; 	//si c'est la position de l'antenne alors ignorer
                ipoint=iant+idist;					//coordonnées en maille d'un point de reception
                jpoint=jant+jdist;
                if(ipoint<0 || jpoint<0 || ipoint >= pdm*hautZone || jpoint>=pdm*largZone) continue;

                point.lat=antenna.lat+idist*latBin
                point.lng=antenna.lng+jdist*lngBin;
                d=L.GeometryUtil.length([antenna, point]);


                hpoint=elevation[ipoint][jpoint];
                delta=hant-hpoint-1.5;

                alpha;							//l'angle fait entre l'antenne, les latitudes et le point de reception
                if(jdist!=0) {
                    alpha=Math.atan(idist/(jdist));
                    if(idist<0 && jdist<0)  alpha=alpha+3.14;
                    else if(idist>=0 && jdist<0) alpha=alpha+3.14;
                }
                else {
                    if(idist>0) alpha=1.5707;
                    else alpha=-1.5707;
                }
                jpas=Math.cos(alpha); 			//pas d'avance sur la ligne directe entre l'antenne et le point de reception
                ipas=Math.sin(alpha);
                distPasBin=Math.sqrt(ipas*ipas*hautBin*hautBin+jpas*jpas*largBin*largBin);
                stotal=Math.floor(d/distPasBin);
                s1=0;
                tangmax=0;
                for(s=1;Math.abs(s*ipas)<Math.abs(idist) && Math.abs(s*jpas)<Math.abs(jdist);s++){	//parcours des obstacle avec un pas ipas, jpas
                    dobs=s*distPasBin;
                    hv=hant-(dobs/d)*delta;
                    hobs=elevation[Math.floor(iant+s*ipas)][Math.floor(jant+s*jpas)]
                    if(hobs>hv && ((hobs-hant)/dobs)>tangmax){ 			//si c'est l'obstacle le plus haut
                        tangmax=(hobs-hant)/dobs;
                        s1=s;
                    }
                }

                s2=0;
                tangmax=0;
                for(s=1;Math.abs(s*ipas)<Math.abs(idist);s++){	//parcours des obstacle avec un pas ipas, jpas
                    dobs=s*distPasBin;
                    hv=hpoint+1.5-(dobs/d)*delta;
                    hobs=elevation[Math.floor(ipoint-s*ipas)][Math.floor(jpoint-s*jpas)]
                    if(hobs>hv && ((hobs-hpoint)/dobs)>tangmax){ 			//si c'est l'obstacle le plus haut
                        tangmax=(hobs-hpoint)/dobs;
                        s2=s;
                    }
                }
                var LBull=0.0;
                sobs=0;
                hobs=0;
                if(s1==0 && s2>0) {sobs=stotal-s2;hobs=elevation[Math.floor(ipoint-s2*ipas)][Math.floor(jpoint-s2*jpas)];}
                if(s1>0 && s2==0) {sobs=s1;hobs=elevation[Math.floor(iant+s1*ipas)][Math.floor(jant+s1*jpas)];}
                if(s1>0 && s2>0){
                    delta1=(hant-elevation[Math.floor(iant+s1*ipas)][Math.floor(jant+s1*jpas)]);
                    delta2=(hpoint+1.5-elevation[Math.floor(ipoint-s2*ipas)][Math.floor(jpoint-s2*jpas)]);
                    d1=s1*distPasBin;
                    d2=s2*distPasBin;
                    s3=stotal-s2;
                    min=1000.0;
                    for(s=s1;s<=s3;s++){
                        dobs1=s*distPasBin;
                        dobs2=(stotal-s)*distPasBin;
                        if(Math.abs((hpoint+1.5-delta2*dobs2/d2)-(hant-delta1*dobs1/d1))<min){
                            min= Math.abs((hpoint+1.5-delta2*dobs2/d2)-(hant-delta1*dobs1/d1));
                            sobs=s;
                            hobs=hpoint+1.5-delta2*dobs2/d2;
                        }
                    }
                }
                if(s1==0 && s2==0) LBull=0.0;
                else{
                    obstacle=new google.maps.LatLng(antenna.lat+sobs*ipas*latBin, antenna.lng+sobs*jpas*lngBin);
                    d1=google.maps.geometry.spherical.computeDistanceBetween(antenna,obstacle);
                    d2=google.maps.geometry.spherical.computeDistanceBetween(point,obstacle);
                    R1=Math.sqrt(0.3*d1*d2/(d1+d2));
                    hv=hant-(d1/(d1+d2))*delta;
                    v=(hobs-hv)*Math.sqrt(2)/R1;
                    if(v>1) LBull=-20*Math.log10(0.225/v);
                }
                if(LBull<0){
                    if(LBull<0) LBull=0.0;
                }
                LFS=32.4+20*Math.log10((d)/1000.0)+20*Math.log10(bande);

                L=LFS+LBull
                angle=180*Math.atan(Math.abs(hant-hpoint)/d)/Math.PI;

                angle=tilt-angle;
                if(angle<0)	angle=360+angle;
                angleindex=Math.floor(angle/5);
                L=L+ CCost-VertRadiationPattern[angleindex];

                if(antennes[a].omni==false){
                    if(idist==0 && jdist>0) angle=90;
                    else if(idist==0 && jdist<0) angle=270;
                    else {
                        angle=180*Math.atan(jdist/idist)/Math.PI;
                        if(idist<0)
                            angle=angle+180;
                        if(angle<0) angle=angle+360;
                    }
                    angle=Math.abs(angle-azimut);
                    angleindex=Math.floor(angle/5);
                    L=L-HorzRadiationPattern[angleindex];
                }

                puissance[a][ipoint][jpoint]=antennes[a].puissance-L;
            }
    }
    document.getElementById('cartepuissance').enabled='';
}
function vider() {
    while(bins.length){
        bins.pop().remove();
    }
}

function batiment(){
    document.getElementById('message').value="Positionner le 1er coin du batiment";
    modeclick=3;

    document.getElementById('cartepuissance').disabled='disabled';
    document.getElementById('carteinterference').disabled='disabled';
    document.getElementById('cartehandover').disabled='disabled';
    document.getElementById('cartecellule').disabled='disabled';
    document.getElementById('carteresidence').disabled='disabled';
}
var batiments=[];
var axes=[];
var hautsBat=[];
var coinsBat=[];
function placeBat(location){
    coinsBat.push(location);
}
function placeBat2(location){
    coinsBat.push(location);
    bat = L.polygon(coinsBat,
        {fillColor: 'grey',
            fillOpacity: 1,
            color : 'transparent'}).addTo(mymap);
    batiments.push(bat);
    bat.on('dblclick', function(event) {
        rep=confirm("voulez vous supprimer le batiment");
        if(rep==true) {
            index=batiments.indexOf(this);
            for(i=0;i<pdm*hautZone;i++){
                for(j=0;j<largZone*pdm;j++){
                    point=L.latLng(coinSud.lat+i*latBin, coinSud.lng+j*lngBin);
                    if(this.getBounds().contains(point))
                    {architecture[i][j]=0;}
                }
            }
            batiments.splice(index, 1);
            hautsBat.splice(index,1);
            this.remove();
        }
    });
    bat.on('contextmenu', function(event) {
        index=batiments.indexOf(this);
        rep=alert("Hauteur du batiment : "+hautsBat[index]+ " metres");
    });
    coinsBat=[];

    h=parseInt(prompt("Enter the height of the building in meters", "10"));

    for(i=0;i<pdm*hautZone;i++){
        for(j=0;j<largZone*pdm;j++){
            point=L.latLng(coinSud.lat+i*latBin, coinSud.lng+j*lngBin);
            if(bat.getBounds().contains(point))
            {
                architecture[i][j]=h;
            }
        }
    }
    hautsBat.push(h);
    document.getElementById('message').value="choisissez une action !";
}

function addAntenne(){
    document.getElementById('message').value="Positionnez l'antenne ! ou Escap pour annuler !";
    frameantenna.style.visibility="visible";
    document.getElementById('omni').checked=true;
    modeclick=1;

    document.getElementById('propag').disable='disabled';
    document.getElementById('cartepuissance').disabled='disabled';
    document.getElementById('carteinterference').disabled='disabled';
    document.getElementById('cartehandover').disabled='disabled';
    document.getElementById('cartecellule').disabled='disabled';
    document.getElementById('carteresidence').disabled='disabled';
}


function cartecellule(){
    vider();
    zonearea.cellules = Array(hautZone*pdm).fill(Array(largZone*pdm).fill(-1));
    zonearea.mobilite = Array(hautZone*pdm).fill(Array(largZone*pdm).fill(Array(4).fill(0)));
   /* cellules = Array(hautZone*pdm).fill(Array(largZone*pdm).fill(-1));
    mobilite = Array(hautZone*pdm).fill(Array(largZone*pdm).fill(Array(4).fill(0))); */
    seuil=parseInt(document.getElementById('seuil').value);
    coinSudlat=coinSud.lat;
    coinSudlng=coinSud.lng;
    var a=0;
    for(i=0;i<hautZone*pdm;i++){
        for(j=0;j<largZone*pdm;j++){
            max=-1000;
            bestant=-1;
            for(a=0;a<nbantennes;a++){
                if(puissance[a][i][j]>max) {max=puissance[a][i][j];	bestant=a;}
            }
            zonearea.cellules[i][j] = bestant;

            if(max<seuil) continue;
            plat=coinSudlat+i*latBin;
            plng=coinSudlng+j*lngBin;

            r=(bestant*82)%213;
            v=(bestant*17)%207;
            b=(bestant*87)%107+107;
            if(r<16)strred="0"+r.toString(16); else strred=r.toString(16);
            if(b<16)strblue="0"+b.toString(16); else strblue=b.toString(16);
            if(v<16)strgreen="0"+v.toString(16); else strgreen=v.toString(16);
            couleur="#"+strred+strgreen+strblue;

            var bin = L.polygon([
                [plat, plng],
                [plat+latBin, plng],
                [plat+latBin, plng+lngBin],
                [plat, plng+lngBin]
            ],{fillColor: couleur,
                fillOpacity: 1,
                color : 'transparent'}).addTo(mymap);
            bins.push(bin);
        }
    }
    zonearea.fillMobiliteTableRand();
    document.getElementById('laButton').disabled = '';
}
function choixenv(){
    m=document.getElementById('methode').value;
    if(m==8){
        rep=confirm("Est un environnement urbain ?");
        if(rep==true)
            CCost=3;
        else CCost=0;
    }
    document.getElementById('propag').disable='disabled';
    document.getElementById('cartepuissance').disabled='disabled';
    document.getElementById('carteinterference').disabled='disabled';
    document.getElementById('cartehandover').disabled='disabled';
    document.getElementById('cartecellule').disabled='disabled';
    document.getElementById('carteresidence').disabled='disabled';
}
function choixcarto(){
    rep=confirm("Transparent pour les zones hors seuils ?");
    if(rep==true)
        carto=true;
    else carto=false;
}
function cartepuissance(){
    vider();
    seuil=parseInt(document.getElementById('seuil').value);
    coinSudlat=coinSud.lat;
    coinSudlng=coinSud.lng;
    for(i=0;i<hautZone*pdm;i++){
        for(j=0;j<largZone*pdm;j++){
            max=-1000;
            for(var a=0;a<nbantennes;a++){
                if(puissance[a][i][j]>max) max=puissance[a][i][j];
            }
            if(max<seuil) continue;
            plat=coinSudlat+i*latBin;
            plng=coinSudlng+j*lngBin;
            couleur=GetColor(Math.floor(max));
            var bin = L.polygon([
                [plat, plng],
                [plat+latBin, plng],
                [plat+latBin, plng+lngBin],
                [plat, plng+lngBin]
            ],{fillColor: couleur,
                fillOpacity: 1,
                color : 'transparent'}).addTo(mymap);
            bins.push(bin);
        }
    }
}
function carteinterference(){
    vider();
    seuil=parseInt(document.getElementById('seuil').value);
    for(i=0;i<hautZone*pdm;i++){
        for(j=0;j<largZone*pdm;j++){
            max=-1;
            suminterf=Math.pow(10,-15);
            for(var a=0;a<nbantennes;a++){
                if(Math.pow(10,puissance[a][i][j]/10.0)>max) {
                    if(max!=-1)	suminterf+=max;
                    max=Math.pow(10,puissance[a][i][j]/10.0);
                }
                else suminterf+=Math.pow(10,puissance[a][i][j]/10.0);
            }
            CIR=max/suminterf;
            if(CIR>1.5) continue;
            else if(CIR>1) {r=1;v=69;b=250;}
            else if(CIR>0.5){r=1;v=250;b=57;}
            else if(CIR>0.33){r=188;v=251;b=0;}
            else if(CIR>0.25){r=244;v=251;b=0;}
            else if(CIR>0.20){r=251;v=220;b=0;}
            else {r=250;v=123;b=0;}

            if(r<16)strred="0"+r.toString(16); else strred=r.toString(16);
            if(b<16)strblue="0"+b.toString(16); else strblue=b.toString(16);
            if(v<16)strgreen="0"+v.toString(16); else strgreen=v.toString(16);
            couleur="#"+strred+strgreen+strblue;

            plat=coinSud.lat+i*latBin;
            plng=coinSud.lng+j*lngBin;

            var bin = L.polygon([
                [plat, plng],
                [plat+latBin, plng],
                [plat+latBin, plng+lngBin],
                [plat, plng+lngBin]
            ],{fillColor: couleur,
                fillOpacity: 1,
                color : 'transparent'}).addTo(mymap);
            bins.push(bin);
        }
    }
}
function onMapClick(e) {
    //alert("You clicked the map at " + e.latlng);
    if(modeclick==0) {modeclick=2;placeCoin(e.latlng);}
    else if(modeclick==1) {modeclick=2;placeAntenne(e.latlng,0);}
    else if(modeclick==3) {placeBat(e.latlng);}
}
function onMapDbClick(e) {
    if(modeclick==3) {modeclick=2;placeBat2(e.latlng);}
}
//google.maps.event.addDomListener(window, 'load', initialize);


var mymap = L.map('mapid').setView([47.094818, 5.491389], 13);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.streets'
}).addTo(mymap);
mymap.on('click', onMapClick);
mymap.on('dblclick', onMapDbClick);
frameantenna=document.getElementById('frameantenna');
frameantenna.style.visibility='hidden';

function initLa(){
    nbZoneMin = parseInt(document.getElementById('minLa').value);
    nbZoneMax = parseInt(document.getElementById('maxLa').value);
    zonearea.calculateLa2(nbantennes, nbZoneMin, nbZoneMax);
}
var buttonLa = document.getElementById('laButton');
buttonLa.onclick=initLa;