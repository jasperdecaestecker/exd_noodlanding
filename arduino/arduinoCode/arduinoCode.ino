const int input1 = 4;
const int input2 = 5;
const int input3 = 6;
const int input4 = 7;

int statusInput1 = 0;
int statusInput2 = 0;
int statusInput3 = 0;
int statusInput4 = 0;
   
void setup()
{
  Serial.begin(9600);
  pinMode(input1, INPUT);
  pinMode(input2, INPUT);
  pinMode(input3, INPUT);
  pinMode(input4, INPUT);
}

void loop()
{
  statusInput1 = digitalRead(input1);
  statusInput2 = digitalRead(input2);
  statusInput3 = digitalRead(input3);
  statusInput4 = digitalRead(input4);
  
  if(statusInput1 == HIGH)
  {
    Serial.print("input 1 is high in the sky /n");
  }
   if(statusInput2 == HIGH)
  {
    Serial.print("input 2 is high in the sky /n");
  }
   if(statusInput3 == HIGH)
  {
    Serial.print("input 3 is high in the sky /n");
  }
   if(statusInput4 == HIGH)
  {
    Serial.print("input 4 is high in the sky /n");
  }
}
