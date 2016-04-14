$(function()
{
  var tabla = "",
      id=0,
      aleatorios=[],
      num,
      nivel=1,
      dimension=nivel+1,
      sub_nivel=1,
      fallas=0,
      aciertos=0,
      validaAciertos=[],
      li,
      tamano=100,
      puntuacion=0,
      posCorrectas=0,
      puntuacionVal=dimension*10,
      c=0,
      c2=0;
      tiempo=60,
      animacion="flash";

  nom_div("fallas").innerHTML = ("<h3>Intentos Fallidos:  "+fallas+"</h3>");
  nom_div("puntuacion").innerHTML = ("<h3>Puntuacion:         "+puntuacion+"</h3>");
  nom_div("patron").innerHTML = ("<h3>Aciertos de patron: "+posCorrectas+"</h3>");
  nom_div("inicio").innerHTML = ("Inicio");
  $("#termina").hide();

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

  function aleatorio()
  {
    num=Math.floor(Math.random()*(dimension*dimension))+1;
  }

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
  })(2);

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
        c=1;
        clearInterval(timer1);
      }
    }
    return completado;
  }

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
          console.log("esta en clickeados"+ validaAciertos.indexOf(aleatorios[cont2])+" "+aleatorios[cont2]+" "+validaAciertos[cont2]);
          setInterval(function()
          {
            $("#tabla_"+aleatorios[cont2]).removeClass(animacion1).css("background-color","rgba(123, 145, 123, 0.7)");
            cont2++;
            if(cont2===aleatorios.length)
            {
              clearInterval(inter);
              if(c===1){
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

  var timer1;
  function timer(tiempo)
  {
    if(c===1)
    {
      tiempo=60;
      clearInterval(timer1);
    }
    if(c2>1)
    {
      clearInterval(timer1);
    }
    timer1=setInterval(function()
    {
      if(c2>1)
      {
        c2=1;
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

  function finJuego(tiempo, nivel)
  {
    if(tiempo===0 || nivel>12)
    { var img;
      clearInterval(inter);
      if(nivel<=4){
        console.log(nivel);
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
        html: '<p>Cantidad de aciertos:       '+aciertos+' = ' + puntuacion+
          '</p><p>Aciertos en patrones: '    +posCorrectas +' = ' +posCorrectas*15
         +'</p><p>Cantidad de fallas: '      +fallas+' = ' +((fallas*5)*-1)+
          '</p><p>____________________________</p>'+
          '<p>            Puntuacion total: '+(puntuacion+(posCorrectas*15)-(fallas*5))+'</p>',
        width: 400,
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
          for(var k =0; k<=validaAciertos.length; k++)
          {
          console.log(validaAciertos[k]+" - "+validaAciertos.length);
          }
        }
      }
      return cuadrado;
    })
  }

  function patronCorrecto() {
    for(var y=0; y<aleatorios.length; y++){
      if (aleatorios[y]===Number(validaAciertos[y])) {
        posCorrectas++;
        nom_div("patron").innerHTML = ("<h3>Aciertos de patron: "+posCorrectas+"</h3>");
      }
      }
  }

var des;
  $("#inicio").click(function()
  {
    $("#inicio").prop('disabled', true);
    c++;
    c2++;
    nom_div("inicio").innerHTML = ("Repetir Patron");
    $("#termina").show();
    ion.sound.play("button_tiny");
    nom_div("nivel").innerHTML = "Nivel: "+nivel+"-"+sub_nivel;
    iniciaPartida();
    for(var t=0; t<aleatorios.length; t++)
    {
      console.log("--"+aleatorios[t]);
    }
    if(c>1)
    {
      $("#press").show();
      nom_div("press").innerHTML = ("-10");
    }
  });

  $("#termina").click(function()
  {
    tiempo=0;
    finJuego(tiempo, nivel);
  })

  function nom_div(div)
  {
    return document.getElementById(div);
  }

  function randomColor()
  {
   	// from http://www.paulirish.com/2009/random-hex-color-code-snippets/
   	return '#'+(function lol(m,s,c){return s[m.floor(m.random() * s.length)] +
   	(c && lol(m,s,c-1));})(Math,'0123456789ABCDEF',4);
  };

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
