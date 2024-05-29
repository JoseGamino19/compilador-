grammar Compilador;
import Reglas ;
// Empezamos con la fase semántica

start: VOID MAIN '{' inic*  (RETURN)? '}'  # iniciocod
;

//conts: inic  # asigConts
  //   ;

inic:                           
     INT ID COM                 # AsignInt 
     | INT ID IGUAL expr COM    #AsingDeclarOp
     | ID IGUAL expr COM        #prueba
     | expr                     #oper
     | if                       #ifini
     | impression               #impesiones
     | ciclo                    #ciclos 
     | decremento               #sumas
;

if: IF PARABI condition PARCER LLAVEA inic* LLAVEC elsesi?   #ifsi
; 

elsesi: 
ELSE IF PARABI condition PARCER LLAVEA inic LLAVEC elsesi? #elseif
|ELSE LLAVEA inic LLAVEC  #else
;

condition : 
condition op=(Y|AD) condition                                     #conditionOrAnd
|expr opert=('<' | '<=' | '>' | '>=' | '==' |'!='|RESIDUO) expr   #conditionOP 
| PARABI condition PARCER                                         #conditionParent
| TRUE                                                            #conditionTrue
| FALSE                                                           #conditionFalse
;

expr: 
expr operation=('*'|'/') expr           # MulDiv
| expr operation=('+'|'-') expr               # AddSub
| expr RESIDUO expr                           # Residuo                              
| ID ADDIGUAL expr COM                      # addigual
| NUMBER                                      # int
|ID                                           # id
| '(' expr ')'                                # parens
; 

ciclo:
WHILE PARABI condition PARCER LLAVEA inic* (decremento)? LLAVEC   # whileopc
;

decremento: ID ( INCREMENTO | DECREMENTO) COM 
; 

impression:
PRINTF PARABI ORACION PARCER COM             # impreOrac
| PRINTF PARABI ID PARCER COM                # impreIds
;


//Insid es int 
//burn es char 
//bob es string 

