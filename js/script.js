$(function()
{
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


  nom_div("inicio").innerHTML = ("Inicio");
  $("#termina").hide();
  $("#bonus").hide();

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

//Funcion para determinar cuando un cuadro que se encuentre dentro del patron mostrado ya sido clickeado
  function aciertoRepetido() {
   var aciertorepe = false;
   for (var i=0; i<validaAciertos.length; i++)
   {
     if (li[1] === validaAciertos[i])
     {
       aciertorepe = true;
     }
    }
    return aciertorepe;
  }

//Funcion para validar que la puntuacion sea la maxima del nivel para el cambio de sub_nivel, dimension de la tabla, tamaño de los cuadros del juego
  function validaPuntuacion()
  {
    var completado=false;
    if(puntuacion=== puntuacionVal)
    {
      if(sub_nivel>2){
        dimension+=1;
        sub_nivel=0;
        finJuego(tiempo, nivel);
        nivel++;
        if(tamano>20)
        {
          tamano-=10;
        }
      }
      completado=true;
      if(nivel>1||sub_nivel>1)
      {
        click=1;
        clearInterval(timer1);
      }
    }
    return completado;
  }

//Funcion para mostrar el patron generado a traves de cambio en el color de los cuadros y animacion de los cuadros
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

//Funcion para controlar el tiempo del juego
  var timer1;
  function timer(tiempo)
  {
    if(click===1)
    {
      tiempo=60;
      clearInterval(timer1);
    }
    if(click2>1)
    {
      clearInterval(timer1);
    }
    timer1=setInterval(function()
    {
      if(click2>1)
      {
        click2=1;
        if(tiempo>10)
        {
        tiempo-=10;
        }else
        {
          tiempo-=tiempo-1;
          clearInterval(timer1);
          finJuego(tiempo, nivel);
        }
      }
      tiempo--;
      nom_div("crono").innerHTML="Tiempo restante: 00:"+tiempo;
      if(tiempo<10){
        nom_div("crono").innerHTML="Tiempo restante: 00:0"+tiempo;
      }
      if(tiempo === 0)
      {
        clearInterval(timer1);
        finJuego(tiempo, nivel);
      }
    },1000);
  }

//Funcion para determinar cuando se finaliza el juego
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
          '<p> <font color="green"><small>Bonus por aciertos patrones completos: </small> ' +cuentaBonus+'-> +'+ (cuentaBonus*20) + '</font></p>'+
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

//Funcion para ejecutar cambioEstilos y el evento click de los cuadros del juego
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

//Funcion para determinar cuando una posicion clickeada corresponda a una posicion correcta de un patron
  function patronCorrecto() {
    for(var y=0; y<aleatorios.length; y++){
      if (aleatorios[y]===Number(validaAciertos[y])) {
        posCorrectas++;
        bonus++;
        if(bonus===aleatorios.length){
          $("#bonus").fadeIn();
          $("#bonus").fadeOut();
          cuentaBonus++;
          if (validaAciertos.length===aleatorios.length) {
            bonus=0;
          }
        }
        nom_div("patron").innerHTML = ("<h3>Aciertos de patron: "+posCorrectas+"</h3>");

      }
      }
  }

//Evento del boton inicio
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

//Evento del boton termina, para finalizar la partida
  $("#termina").click(function()
  {
    ion.sound.play("button_tiny");
    tiempo=0;
    finJuego(tiempo, nivel);
  })

//Funcion para obtener el id de un elemento del DOM
  function nom_div(div)
  {
    return document.getElementById(div);
  }

//Funcion para generar colores aleatorios
  function randomColor()
  {
   	// from http://www.paulirish.com/2009/random-hex-color-code-snippets/
   	return '#'+(function lol(m,s,c){return s[m.floor(m.random() * s.length)] +
   	(c && lol(m,s,c-1));})(Math,'0123456789ABCDEF',4);
  };

//configuracion para los sonidos agregados a los botones y cuadros del juego
    ion.sound({
      // from: http://ionden.com/a/plugins/ion.sound/demo.html
      sounds: [
          {name: "snap"},
          {name: "water_droplet_3"},
          {name: "button_tiny"}
      ],
      // main config
      path: "static/sounds/",
      preload: true,
      multiplay: true,
      volume: 0.9
    });

});
