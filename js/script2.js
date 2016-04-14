$(function()
{
  console.log("prueba");
  var min=1,max=10;
  var aleatorios=[];
  var num;

  function aleatorio(){
    num=Math.floor(Math.random()*(10-1+1))+1;
  }

  function repetido() {
   var repe = false;
   for (var i=0; i<aleatorios.length; i++)
   {
     if (num === aleatorios[i]) {
       repe = true;
     }
    }
    return repe;
 }
var numAleatorios = function(){
   for(var j=0; j<=2; j++){
     aleatorio();
    if(!repetido()){
      console.log(repetido());
      aleatorios.push(num);
    }else {
      j--;
      aleatorio();
    }
   }
 }()


console.log(aleatorios.length);
for(var t=0; t<aleatorios.length; t++)
{
  console.log("--"+aleatorios[t]);
}
});
