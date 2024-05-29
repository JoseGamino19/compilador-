import CompiladorVisitor from "../../grammar/CompiladorVisitor.js";
export let resultado
export let imprecion
export let error 
export let memoria = new Map()
export let jasmin
let etiquet=0


// This class defines a complete generic visitor for a parse tree produced by ArrayInitParser.

export default class CustomVisitor extends CompiladorVisitor {
	
	generadorEtiqu() {
		return 'Etiq'+etiquet++ 
	}
	variables = {}
	varIndex = 0
	bandera = true
	// Visit a parse tree produced by CompiladorParser#iniciocod.
	visitIniciocod(ctx) {
		imprecion=''
		jasmin=''
			this.addCodeJasmin('.class public Ejerc')
			this.addCodeJasmin('.super java/lang/Object')
			this.addCodeJasmin('.method public static main([Ljava/lang/String;)V')
			this.addCodeJasmin('    .limit stack 50')
			this.addCodeJasmin('    .limit locals 50')
			this.visitChildren(ctx);
			this.addCodeJasmin('    return')
			this.addCodeJasmin('.end method')
		}

		addCodeJasmin(line) {
			jasmin += line + '\n';
		}

		  // Visit a parse tree produced by CompiladorParser#asigConts.
		/*visitAsigConts(ctx) {
			console.log('hola1')
			return this.visitChildren(ctx);
		}*/

		  // Visit a parse tree produced by CompiladorParser#AsignInt.
		visitAsignInt(ctx) {
			console.log('hola2')
			let id = ctx.ID().getText();
			let value = 0;
			let index = this.variableIndex(id)
			agregarIdMap(id,value)
			this.addCodeJasmin('	ldc 0')
			this.addCodeJasmin('	istore_'+index)
			return value;
		}

		  // Visit a parse tree produced by CompiladorParser#AsingDeclarOp.
		visitAsingDeclarOp(ctx) {
			console.log('hola3')
			let id = ctx.ID().getText()
			let value = this.visit(ctx.expr())
			let index = this.variableIndex(id)
			agregarIdMap(id,value)
			this.addCodeJasmin('	istore_'+index)
			return value;
		}

		visitOperVariables(ctx){
			console.log('hola4')
			return this.visitChildren(ctx)
		}

		  // Visit a parse tree produced by CompiladorParser#oper.
		visitOper(ctx) {
			console.log('hola5')

			return this.visitChildren(ctx);
		}

		visitImpesiones(ctx){
			console.log('hola6')
			return this.visitChildren(ctx);
		}

		  // Visit a parse tree produced by CompiladorParser#parens.
		visitParens(ctx) {
			console.log('hola7')
			return this.visit(ctx.expr());
		}

	  	  // Visit a parse tree produced by CompiladorParser#MulDiv.
		visitMulDiv(ctx) {
			console.log('hola8')
			const numero1=this.visit(ctx.expr(0))
			const numero2=this.visit(ctx.expr(1))

			if (ctx.operation.type==18){
				resultado = numero1*numero2
				if(this.bandera){this.addCodeJasmin('	imul')}
			}else {
				resultado = numero1/numero2
				if(this.bandera){this.addCodeJasmin('	idiv')}
			} 
			return resultado
		}

	  	  // Visit a parse tree produced by CompiladorParser#AddSub.
		visitAddSub(ctx) {
			console.log('hola9')
			const numero1=this.visit(ctx.expr(0))
			const numero2=this.visit(ctx.expr(1))
			if (ctx.operation.type==20){
				resultado = numero1+numero2
				if (this.bandera){this.addCodeJasmin('	iadd')}
				}else {
					resultado = numero1-numero2
					if(this.bandera){this.addCodeJasmin('	isub')}
				}
			return resultado
		}

	  // Visit a parse tree produced by CompiladorParser#int.
		visitInt(ctx) {
			console.log('hola10')
			if (this.bandera){this.addCodeJasmin('	ldc '+ ctx.NUMBER().getText())}
			return Number(ctx.getText())
		}

		visitId(ctx){
			console.log('hola11')
			let id = ctx.ID().getText(); 
			if (memoria.has(id)) {
				let index = this.variableIndex(id)
				if (this.bandera){this.addCodeJasmin('	iload_'+index)}
				return memoria.get(id); 
			}
		}

		visitImpreOrac(ctx) {
			console.log('hola12')
			if (ctx.ORACION()) {
				let lect = ctx.ORACION().getText();
				let filtro = lect.replace(/["']/g, '')
				imprecion += `${filtro} \n`;
				console.log(imprecion)
				if (this.bandera){
					this.addCodeJasmin('	getstatic java/lang/System/out Ljava/io/PrintStream;') 
					this.addCodeJasmin('	ldc '+ lect)
					this.addCodeJasmin('	invokevirtual java/io/PrintStream/println(Ljava/lang/String;)V')
				}
		  }
		}

		visitImpreIds(ctx) {
			console.log('hola13')
			let id = ctx.ID().getText()
			let index = this.variableIndex(id)
			if (this.bandera){
				this.addCodeJasmin('	getstatic java/lang/System/out Ljava/io/PrintStream;')
				this.addCodeJasmin('	iload_'+index)
				this.addCodeJasmin('	invokevirtual java/io/PrintStream/println(I)V')}
			verificarIdMap(id)
		  }


		visitPrueba(ctx){
			console.log('hola14')
			let id= ctx.ID().getText()
			let value = this.visit(ctx.expr())
			let index = this.variableIndex(id)
			memoria.set(id,value)
			this.addCodeJasmin('	istore_'+index)
			//return this.visitChildren(ctx);
		}

		visitIfsi(ctx){
			console.log('hola15')
			const resultado =this.visit(ctx.condition())
			let etiquetaInic=this.generadorEtiqu()
			let etiquetaFin=this.generadorEtiqu()
			if(this.bandera){jasmin+=' '+etiquetaInic+'\n'}
			if (resultado) {
				this.visit(ctx.inic())
				if (this.bandera){this.addCodeJasmin('	goto '+etiquetaFin+'')}
				if (this.bandera){this.addCodeJasmin(	'	'+etiquetaInic+':')}
			}
			else if (ctx.elsesi()) {
				if (this.bandera){this.addCodeJasmin('	goto '+etiquetaFin+'')}
				if (this.bandera){this.addCodeJasmin('	'+etiquetaInic+':')}
						this.visit(ctx.elsesi())
			}
			if (this.bandera){this.addCodeJasmin(		etiquetaFin+':')}
		}

	// Visit a parse tree produced by CompiladorParser#elseif.
	visitElseif(ctx) {
		console.log('hola16')
		let etiquetaInic=this.generadorEtiqu()
		let etiquetaFin=this.generadorEtiqu()
				const resultado = this.visit(ctx.condition())
				if (this.bandera){jasmin+=' '+etiquetaInic+'\n'}
				if (resultado) {
					this.visit(ctx.inic())
				}
				if (this.bandera){this.addCodeJasmin('	goto '+etiquetaFin+'')}
				if (this.bandera){this.addCodeJasmin('	'+etiquetaInic+':')}
				if (this.bandera){this.addCodeJasmin('	'+etiquetaFin+':')}
		if (ctx.ELSE()){
			this.visit(ctx.elsesi())
		}

	  }

	  // Visit a parse tree produced by CompiladorParser#else.
	  visitElse(ctx) {
		console.log('hola17')
		this.visit(ctx.inic())
	  }


	// Visit a parse tree produced by CompiladorParser#conditionFalse.
	visitConditionFalse(ctx) {
		console.log('hola18')
		if(ctx.FALSE()){
			return false
		}
	  }
  
  
	  // Visit a parse tree produced by CompiladorParser#conditionTrue.
	  visitConditionTrue(ctx) {
		console.log('hola19')
		if (ctx.TRUE()){
			console.log(true)
			return true
		}
	  }
  
  
	  // Visit a parse tree produced by CompiladorParser#conditionOrAnd.
	  visitConditionOrAnd(ctx) {
		console.log('hola20')
		const condition1 = this.visit(ctx.condition(0))
		const condition2 = this.visit(ctx.condition(1))
		const oper = ctx.op.type;

		switch(oper){
			case 30 :
				this.addCodeJasmin('iand')
				return condition1 && condition2
			case 31: 
				this.addCodeJasmin('ior')
				return condition1 || condition2
		}
	  }

	  // Visit a parse tree produced by CompiladorParser#conditionOP.
	  visitConditionOP(ctx) {
		console.log('hola21')
		const expr1 = this.visit(ctx.expr(0));
		const expr2 = this.visit(ctx.expr(1));
		const operator = ctx.opert.type;

		switch (operator) {
			case 5:
				if (this.bandera){jasmin+='	if_icmpge '} 
				return expr1 < expr2
			case 6:
				if (this.bandera){jasmin+='	if_icmpgt '}
				return expr1 <= expr2
			case 7:
				if (this.bandera){jasmin+='	if_icmple '}
				return expr1 > expr2
			case 8:
				if (this.bandera){jasmin+='	if_icmplt '}
				return expr1 >= expr2
			case 9:
				if (this.bandera){jasmin+='	ifeq '}
				return expr1 == expr2
			case 10:
				if (this.bandera){jasmin+='	if_icmpne '}
				return expr1 != expr2
			case 30:
				//this.addCodeJasmin('')
				return expr1 && expr2
			case 31:
				//this.addCodeJasmin('')
				return expr1 || expr2
			default:
				throw new Error(`Operador relacional no soportado: ${operator}`);
	}
	  }
	  // Visit a parse tree produced by CompiladorParser#conditionParent.
	  visitConditionParent(ctx) {
		console.log('hola22')
		if (ctx.condition()) {
            return this.visit(ctx.condition());
        }
	  }		

		visitWhileopc(ctx) {
			console.log('hola23')
			let visitas=[]
			let etiquetaInic=`loop_${this.generadorEtiqu()}`
			let etiquetaFin=`loop_${this.generadorEtiqu()}`
			this.addCodeJasmin(`	${etiquetaInic}:`)
			let condicionEvaluada = this.visit(ctx.condition())
			this.addCodeJasmin(etiquetaFin)
			while(condicionEvaluada){
				const resultadoVisita=this.visit(ctx.inic())

				visitas.push(resultadoVisita)
				if (ctx.decremento()){
					this.visit(ctx.decremento())
				}
				if (this.bandera){this.addCodeJasmin('	goto '+etiquetaInic+'')}
				this.bandera=false
				condicionEvaluada=this.visit(ctx.condition())
			}
			this.bandera=true
			this.addCodeJasmin(`	${etiquetaFin}:`)
			return visitas
		  }

		  visitDecremento(ctx) {
			console.log('hola23')
			const id = ctx.ID().getText()
			let valor = memoria.get(id)
			let index = this.variableIndex(id)

			if (ctx.INCREMENTO()){
				if (this.bandera){this.addCodeJasmin(`	iinc ${index} 1`)}
				valor++
			}
			else if (ctx.DECREMENTO()){
				if (this.bandera){this.addCodeJasmin(`	iinc ${index} -1`)}
				valor--
			}
			memoria.set(id,valor)
		}
		
		visitResiduo(ctx) {
			console.log('hola24')
			const exp1 = this.visit(ctx.expr(0))
			const exp2 = this.visit(ctx.expr(1))
			let residuo=exp1%exp2
			this.addCodeJasmin('	 irem')
			this.addCodeJasmin('	ldc '+residuo)
			return exp1 % exp2
		}
		

		variableIndex(id) {
			if (!(id in this.variables)) {
				this.variables[id] = this.varIndex++;
			}
			return this.variables[id];
		}

			// Visit a parse tree produced by CompiladorParser#addigual.
		visitAddigual(ctx) {
			const id = ctx.ID().getText()
			const valor = memoria.get(id)
			let index = this.variableIndex(id) 
			if (this.bandera){this.addCodeJasmin('	iload_'+index)}
			const value = this.visit(ctx.expr())
			memoria.set(id, valor + value)
			if(this.bandera){this.addCodeJasmin('	iadd')}
			if(this.bandera){this.addCodeJasmin('	istore_'+index)}
		}
	
	}

	function verificarIdMap(value){
		console.log('hola25')
		if(!memoria.has(value)){
			error=`Error la variable: ${value} no existe`
			throw new Error(`Error la variable: ${value} no existe`)
		}else if (memoria.has(value)){
			let valorAsociado = memoria.get(value)
			imprecion += `${valorAsociado} \n`
		}
		
	}
	
	function agregarIdMap(value,num) {
		console.log('hola25')
		if (!memoria.has(value)) {
			memoria.set(value,num);
			console.log(`Elemento agregado: ${value} y su valor es ${num}`);
		} else {
			console.log(`El identificador ${value} ya fue declarado`)
		}
	}




