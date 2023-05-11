int pos = -1;
int data[10000];
bool flag = false;
void setup() 
{
// initialize the serial communication:
Serial.begin(9600);
pinMode(14, INPUT); // Setup for leads off detection LO +
pinMode(12, INPUT); // Setup for leads off detection LO -
 
}
 
void loop() { 
if((digitalRead(14) == 1)||(digitalRead(12) == 1)){
Serial.println('!');
}
else{
if(digitalRead(0)==0){
flag = !flag;
for(int i=0;i<1000;i++)
printf("%d, ", data[i]);
}
if(flag){
  Serial.println(analogRead(A0));
  data[++pos] = analogRead(A0);
}
else
Serial.println(analogRead(A0));
}
//Wait for a bit to keep serial data from saturating

delay(80);
}