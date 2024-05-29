grammar CompiladorC;
import ReglasC ;
// Empezamos con la fase semántica

start: VOID MAIN '{' inic*  (RETURN)? '}' 
;


inic:  
     INT ID COM  
     | INT ID IGUAL expr COM 
     | ID IGUAL expr COM 
     | siono
     | expr
     | impression 
     | ciclo                    
     | decremento               
;

siono: IF PARABI condition PARCER LLAVEA inic* LLAVEC elsesi?  
; 

elsesi: 
ELSE IF PARABI condition PARCER LLAVEA inic LLAVEC elsesi? 
|ELSE LLAVEA inic LLAVEC  
;

condition :condition op=(Y|AD) condition 
| expr opert=('<' | '<=' | '>' | '>=' | '==' |'!=' |RESIDUO) expr 
| PARABI condition PARCER
| TRUE 
| FALSE
;

expr: expr operation=('*'|'/') expr           
| expr operation=('+'|'-') expr    
| expr RESIDUO expr                                
| expr ADDIGUAL expr COM                                                                                   
| NUMBER  
|ID                                   
| '(' expr ')'                      
; 

ciclo:
WHILE PARABI condition PARCER LLAVEA inic* (decremento)? LLAVEC   
;

decremento: ID ( INCREMENTO | DECREMENTO) COM 
;

impression:
     PRINTF PARABI ID PARCER COM 
   | PRINTF PARABI ORACION PARCER COM 
     //| PRINTF PARABI ORACION PARABI SIG #ImpOraciones
     //| PRINTF PARABI ORACION ADD ID PARABI SIG #ImpComp
;