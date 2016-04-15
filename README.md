# Pattern Memory
Es un juego que tiene como objetivo hacer que el usuario revele los bloques que se le muestren ya sea en el mismo orden del patron mostrado o solo los cuadros mostrados, de la misma forma variara su puntuación

#El Juego
Se le mostrara al usuario un patron de cuadros que despues de un tiempo desaparecerán, la finalidad es que el usuario revele los cuadros que se le mostraron ya sea en el mismo orden o en un orden distinto, pero su puntuación sera mayor si el patron es puesto en el orden correcto, otra forma de ganar puntos es que adivine alguna de las posiciones del patron mostrado.

El juego consta de 12 niveles cada uno con 3 sub-niveles y un tiempo para cada nivel de 60 segundos en los cuales debera completar el patron dado, este tiempo se reiniciara en cada nivel despues de mostrar el patron a recordar.

![ScreenShot](https://raw.github.com/szantiago/pattern_memory/gh-pages/img_md/pattern_memory.gif)

![ScreenShot](https://raw.github.com/szantiago/pattern_memory/gh-pages/img_md/swNFJM.gif)


#- Puntaje
El jugador podra seleccionar cualquiera de las figuras del juego lo cual tendra como resultado la suma o disminución de su puntuación de la siguiente manera

- Si elige una de las figuras sin importar el orden en el que se mostro ganara 10 puntos
- Si elige una figura y su posicion es correcta ganara 15 puntos
- Si acierta en el patron como se le mostro ganara 25 puntos extra

![ScreenShot](https://raw.github.com/szantiago/pattern_memory/gh-pages/img_md/248K3-.gif)

|       _Oro_     |       _Plata_     |     _Cobre_      |
|-----------------|:-----------------:|-----------------:|
| ![ScreenShot](https://raw.github.com/szantiago/pattern_memory/gh-pages/imagenes/medalla_oro.png) |  ![ScreenShot](https://raw.github.com/szantiago/pattern_memory/gh-pages/imagenes/medalla_plata.png) | ![ScreenShot](https://raw.github.com/szantiago/pattern_memory/gh-pages/imagenes/medalla_bronce.png) |
| _Nivel 8 a 12_ |    _Nivel 5 a 7_   |   _Nivel 1 a 4_ |





#- Fin de la partida
La partida terminara cuando:
- El tiempo llegue a 0

![ScreenShot](https://raw.github.com/szantiago/pattern_memory/gh-pages/img_md/timer.JPG)

- El nivel 12-3 sea superado

![ScreenShot](https://raw.github.com/szantiago/pattern_memory/gh-pages/img_md/terminar_partida.JPG)

- Cuando el jugador decida terminar la partida oprimiendo el boton terminar partida

![ScreenShot](https://raw.github.com/szantiago/pattern_memory/gh-pages/img_md/fin.png)


#Desarrollo (funciones principales)
El desarrollo se realizo con javascript, JQuery V1.11.1, css.
Se utilizo ion.sound para generar sonidos en los botones y figuras del juego, sweetalert2 para modificar la apariencia del alert

- Inicializacion de variables

```javascript
var tabla = "",                         //Contiene la tabla y sus elementos
    id=0,                               //id de los cuadros de la tabla
    aleatorios=[],                      //array para las posiciones aleatorias usadas para los patrones
    num,                                //numero aleatorio que retorna la funcion aleatorio()
    nivel=1,                            //nivel de juego inicia 1
    dimension=nivel+1,                  //dimension de la tabla
    sub_nivel=1,
    fallas=0,                           //numero de desaciertos que tenga el usuairo
    aciertos=0,                         //numero de aciertos que tenga el usuairo
    validaAciertos=[],                  //contiene los aciertos en el orden que el usuario los encuentre
    li,                                 //contiene el id del cuadro que clickea el usuario
    tamano=100,                         //tamaño inicioal de los cuadros de la tabla del juego
    puntuacion=0,                       //puntos que gana el usuario por los aciertos
    bonus=0,
    cuentaBonus=0,
    posCorrectas=0,                     //aciertos en alguna de las posiciones del patron
    puntuacionVal=dimension*10,         //puntuacion de cada Nivel
    click=0,                            //cuando se pulsa el boton inicio
    click2=0;
    tiempo=60,                          //tiempo para que el usuario resuelva el nivel
    animacion="flash";                  //animacion de la tabla

```
- Se crea la cuadricula que sera el escenario de los patrones
```javascript
//Funcion para la creacion de la tabla o escenario para el juego
//recibe como parametro dimension la cual variara a lo largo del juego
  var escenario = (function escenario(dimension)
  {
    tabla = "<table id = 'cuadros'>";
    for(var columna=0; columna < dimension; columna++)
    {
      tabla+="<tr>";
      for(var fila=0; fila < dimension; fila++)
      {
        id++;
        tabla += "<td>";
        tabla += "<div id='tabla_"+(id)+"' class= 'cuadrado animated "+animacion+"'></div>";
        tabla += "</td>";
      }
      tabla += "<tr>";
    }
    tabla += "</table>";
    $("#tabla").append(tabla);
    $(".cuadrado").css({"width": tamano,	"height": tamano});
    return escenario;
  })(dimension);
```

- Se llena un array con valores aleatorio que más adelante se utilizan para realizar los patrones a traves de 3 funciones:

```javascript
//Funcion para generar numeros aleatorios
  function aleatorio()
  {
    num=Math.floor(Math.random()*(dimension*dimension))+1;
  }

//Funcion para validar que los valores aleatorios que se usaran en los patrones no seran repetidos
  function repetido()
  {
   var repe = false;
   for (var i=0; i<aleatorios.length; i++)
   {
     if (num === aleatorios[i])
     {
       repe = true;
     }
    }
    return repe;
  }

//Funcion para llenar el array de numeros aleatorios con los cuales se haran los patrones
//a partir de la dimension,la longitud del array aleatorios variara segun el nivel en el que se encuentre el juego
  var numAleatorios = (function numAleatorios(dimension)
  {
   for(var j=0; j<dimension; j++){
     aleatorio();
     if(!repetido())
     {
        aleatorios.push(num);
     }else
     {
      j--;
      aleatorio();
     }
   }
   return numAleatorios;
 })(dimension);
```

- A traves de la funcion cambio estilos se muestra al jugador el patron con animacion y colores, esta funcion se ejecuta tanto al inicir la partida como al ir avanzando en los sub-niveles y niveles asi como tambien cuando el jugador requiere que se le muestre nuevamente el patron, en este ultimo caso las figuras que ya fueron seleccionadas seran puestas nuevamente de color

```javascript
var inter;
  function cambioEstilo()
  {
    var cont=0;
    var cont2=0;
    if(cont <= aleatorios.length && nivel<=12)
    {
      finJuego(tiempo, nivel);
      var animacion1="flip";
      inter =setInterval(function()
      {
        $("#tabla_"+aleatorios[cont]).css("background-color",randomColor()).addClass(animacion1);
        ion.sound.play("water_droplet_3");
        cont++;
        if(cont2 <= aleatorios.length && cont === aleatorios.length)
        {
          setInterval(function()
          {
            $("#tabla_"+aleatorios[cont2]).removeClass(animacion1).css("background-color","rgba(123, 145, 123, 0.7)");
            cont2++;
            if(cont2===aleatorios.length)
            {
              clearInterval(inter);
              for(var v =0; v<validaAciertos.length; v++)
              {
                $("#tabla_"+validaAciertos[v]).css("background-color",randomColor());
              }
              if(click===1){
                timer(tiempo);
              }
            }
          },1000);
          $("#inicio").prop('disabled', false);
          $("#press").hide();
        }
      },1000);
    }else{
      finJuego(tiempo, nivel);
    }
  }
```
- La funcion iniciaPartida dara paso al patron asi como tambien ayudara en la validacion de la respuesta dada por el jugador
```javascript
function iniciaPartida()
{
  cambioEstilo();
  $(".cuadrado").click(function cuadrado(e)
  {
    li = e.target.id;
    li=li.split("_");
    if(aleatorios.indexOf(Number(li[1]))<0)
    {
      ion.sound.play("snap");
      fallas ++;
      nom_div("fallas").innerHTML = ("<h3>Intentos Fallidos:  "+fallas+"</h3>");
    }else
    {
      if(validaAciertos.length==0)
      {
        validaAciertos.push(li[1]);
        $("#tabla_"+li[1]).css("background-color",randomColor());
        aciertos++;
        puntuacion=aciertos*10;
        nom_div("puntuacion").innerHTML = ("<h3>Puntuacion:         "+puntuacion+"</h3>");
      }else
      {
        if(!aciertoRepetido())
        {
          validaAciertos.push(li[1]);
          $("#tabla_"+li[1]).css("background-color",randomColor());
          aciertos++;
          puntuacion=aciertos*10;
          setInterval(function()
          {
            if(validaPuntuacion())
            {
              sub_nivel++;
              nom_div("nivel").innerHTML ="Nivel: "+nivel+"-"+sub_nivel;
              $(".cuadrado").css({"width": tamano,	"height": tamano});
              puntuacionVal=puntuacion+dimension*10;
              $("#cuadros").remove();
              id=0;
              patronCorrecto();
              aleatorios.splice(0,aleatorios.length);
              validaAciertos.splice(0,validaAciertos.length);
              numAleatorios(dimension);
              escenario(dimension);
              iniciaPartida();
            }
          },1000);
          nom_div("puntuacion").innerHTML = ("<h3>Puntuacion:         "+puntuacion+"</h3>");
        }
        for(var k =0; k<validaAciertos.length; k++)
        {
        console.log(validaAciertos[k]+" - "+validaAciertos.length);
        }
      }
    }
    return cuadrado;
  })
  for(var t=0; t<aleatorios.length; t++)
  {
    console.log("--"+aleatorios[t]);
  }
}

```

El evento del boton inicio dara paso al juego asi como tambien muestra varios elementos, despues de ser precionado la primer vez para accionar el juego, toma el nombre de Repetir Patron, que lo que hara es mostrar nuevamente el patron dado en el nivel, y dara valores a algunas variables que ayudaran a determinar el tiempo

```javascript
var des;
  $("#inicio").click(function()
  {
    $("#inicio").prop('disabled', true);
    click++;
    click2++;
    nom_div("inicio").innerHTML = ("Repetir Patron");
    nom_div("fallas").innerHTML = ("<h3>Intentos Fallidos:  "+fallas+"</h3>");
    nom_div("puntuacion").innerHTML = ("<h3>Puntuacion:         "+puntuacion+"</h3>");
    nom_div("patron").innerHTML = ("<h3>Aciertos de patron: "+posCorrectas+"</h3>");
    $("#termina").show();
    ion.sound.play("button_tiny");
    nom_div("nivel").innerHTML = "Nivel: "+nivel+"-"+sub_nivel;
    iniciaPartida();
    if(click>1)
    {
      $("#press").show();
      nom_div("press").innerHTML = ("-10");

    }
  });
```
- La funcion para finalizar la partida, toma varios parametros en cuenta para determinarlo, las cuales son: que el tiempo sea mayor a 0, que el nivel del juego sea mayor a 12 y que el usuario no presione el boton para finalizar la partida.
 Al finalizar la partida mostrara un alert hecho con sweetalert2 el cual muestra: una imagen de una medalla dada por el nivel alcanzado, en que nivel quedo el jugador, su Puntaje por aciertos de figuras mostradas en los patrones, la cantidad de posiciones dentro de los patrones que fueron correctas,las fallas que tubo durante el juego que afectan el Puntaje de manera negativa, una puntuacion parcial que sera la suma de lo anterior y un bonus que es dado por los patrones completos y correctos que hubo durante la partida y un valor total

```javascript
function finJuego(tiempo, nivel)
{
  if(tiempo===0 || nivel>12)
  { var img;
    clearInterval(inter);
    if(nivel<=4){
        img='imagenes/medalla_bronce.png';
    }
    if( nivel>4){
        img='imagenes/medalla_plata.png';
    }
    if(nivel>7){
        img='imagenes/medalla_oro.png';
    }
    //alert("hello");
    swal({
      title: "Game Over",
      imageUrl: img,
      imageWidth: 150,
      imageHeight: 200,
      html: '<p><font color="gray"><h4>Nivel alcanzado: '+nivel+'-'+sub_nivel+'</h4></font></p>'
        +'<p>Cantidad de aciertos:       '+aciertos+' ...... ' + puntuacion+
        '</p><p><small>Posiciones en patrones correcto: </small>'    +posCorrectas +' ... ' +posCorrectas*15
       +'</p><p>Cantidad de fallas:     '+fallas+' .......... ' +((fallas*5)*-1)+
        '</p><p>____________________________</p>'+
        '<p> Puntuacion parcial: '+(puntuacion+(posCorrectas*15)-(fallas*5))+'</p>'+
        '<p> <font color="green"><small>Bonus por aciertos patrones completos: </small> ' +cuentaBonus+'-> +'+ (cuentaBonus*25) + '</font></p>'+
        '</p><p>____________________________</p>'+
        '<p> Puntuacion Total: '+((cuentaBonus*20)+puntuacion+(posCorrectas*15)-(fallas*5))+'</p>',
      width: 400,
      heigth: 600,
      padding: 50,
      background: '#fff url(//www.free-patterns.info/wp-content/uploads/2013/03/gray-spray-wall-ver-3.jpg)',
      confirmButtonText:"Vale",
      confirmButtonColor:"#558450",
      showLoaderOnConfirm:"true",

    }).then(function(){
          location.reload();
      })
  }
}
```

###Autor
 Santiago Lozano

 License
 ----
 MIT
