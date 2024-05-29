// Generated from ./grammarC/CompiladorC.g4 by ANTLR 4.13.1
// jshint ignore: start
import CompiladorCVisitor from '../../grammarC/CompiladorCVisitor';
import antlr4 from 'antlr4'; 
export let Code 
// This class defines a complete generic visitor for a parse tree produced by CompiladorCParser.

export default class CustomVisitorC extends CompiladorCVisitor {
	
	// Visit a parse tree produced by CompiladorCParser#start.
	visitStart(ctx) {
		Code=''
		this.addCodeLine('Cod Pres {');
		this.visitChildren(ctx);
		if(ctx.RETURN()){
			this.addCodeLine('End');
		}
		this.addCodeLine('}');
	}

    // Método auxiliar para añadir texto al código 
    addCodeLine(line) {
        Code += line + '\n';
    }

	// Visit a parse tree produced by CompiladorCParser#inic.
	visitInic(ctx) {
		if (ctx.INT() && ctx.ID() && !ctx.IGUAL()){
			let variable = ctx.ID().getText()
			this.addCodeLine(`Insid ${variable};`)
		}
        if (ctx.INT() && ctx.ID() && ctx.IGUAL() && ctx.expr()) {
            let variable = ctx.ID().getText()
            let valor = this.visit(ctx.expr())
            this.addCodeLine(`Insid ${variable} = ${valor};`)
        } else if (ctx.ID() && ctx.IGUAL() && ctx.expr()) {
            let variable = ctx.ID().getText()
            let valor = this.visit(ctx.expr())
            this.addCodeLine(`${variable} = ${valor} ;`)
        } else if (ctx.impression()) {
            this.visit(ctx.impression())
        } else if (ctx.expr()) {
            this.addCodeLine(this.visit(ctx.expr()) )
        } else if (ctx.siono()) {
			this.visit(ctx.siono())
		}
		else if (ctx.ciclo()){
			this.visit(ctx.ciclo())
		}else if (ctx.decremento()){
			this.visit(ctx.decremento())
		}
	}
	// Visit a parse tree produced by CompiladorCParser#if.
	visitSiono(ctx) {
        this.addCodeLine('Possibly (' + this.visit(ctx.condition()) + ') {');
        this.visit(ctx.inic(0)) 
        this.addCodeLine('}')
		if (ctx.elsesi()){
			this.visit(ctx.elsesi())
		}
	}

	// Visit a parse tree produced by CompiladorCParser#elsesi.
	visitElsesi(ctx) {
		if (ctx.condition()) {
			this.addCodeLine('Otherwise Possibly (' + this.visit(ctx.condition()) + ') {');
			this.visit(ctx.inic());
			this.addCodeLine('}');
		}
		
		// Procesar múltiples bloques else if
		while (ctx.elsesi()) {
			ctx = ctx.elsesi(); // Avanza al siguiente else if en la cadena
			if (ctx.condition()) {
				this.addCodeLine('Otherwise Possibly (' + this.visit(ctx.condition()) + ') {');
				this.visit(ctx.inic());
				this.addCodeLine('}');
			}
		}
		
		// Procesar el bloque else final, si existe
		if (ctx.ELSE && ctx.ELSE()) {
			this.addCodeLine('Otherwise {');
			this.visit(ctx.inic());
			this.addCodeLine('}');
		}
		/*if (ctx.condition()){
			this.addCodeLine('Otherwise Possibly (' + this.visit(ctx.condition()) +') {')
			this.visit(ctx.inic()) 
			this.addCodeLine('}')
		}
		else if (ctx.elsesi()){
			this.visit(ctx.elsesi()) 
		}
			/*else if (ctx.ELSE()){
				this.addCodeLine('Otherwise {')
				this.visit(ctx.inic()) 
				this.addCodeLine('}')
	}*/
}

	// Visit a parse tree produced by CompiladorCParser#condition.
	visitCondition(ctx) {
        if (ctx.TRUE()) {
            return 'Verd'
        } 
         else if (ctx.expr(0) && ctx.expr(1)){
			const operator = ctx.opert.type;
			console.log(operator)
	
			switch (operator) {
				case 5:
					return this.visit(ctx.expr(0)) + ' < ' + this.visit(ctx.expr(1))
				case 6:
					return this.visit(ctx.expr(0)) + ' <= ' + this.visit(ctx.expr(1))
				case 7:
					return this.visit(ctx.expr(0)) + ' > ' + this.visit(ctx.expr(1))
				case 8:
					return this.visit(ctx.expr(0)) + ' >= ' + this.visit(ctx.expr(1))
				case 9:
					return this.visit(ctx.expr(0)) + ' == ' + this.visit(ctx.expr(1))
				case 10:
					return this.visit(ctx.expr(0)) + ' != ' + this.visit(ctx.expr(1))
		}
	}
	else if (ctx.PARABI() && ctx.PARCER()){
		return '('+ this.visit(ctx.condition()) +')'
	}
	else if (ctx.condition(0) && ctx.condition(1)){
		const condition1 = this.visit(ctx.condition(0))
		const condition2 = this.visit(ctx.condition(1))
		const oper = ctx.op.type;

		switch(oper){
			case 30 :
				return condition1 +' && '+ condition2
			case 31: 
				return condition1 + '||' + condition2
		}
	}
	else {
		return 'Fals'
	}


	}

	// Visit a parse tree produced by CompiladorCParser#ciclo.
	visitCiclo(ctx) {
		this.addCodeLine('Case of (' + this.visit(ctx.condition())+') {')
		this.visit(ctx.inic())
		if (ctx.decremento()){
			this.visit(ctx.decremento())
		}
		this.addCodeLine('}')
	  }
  
  
	  // Visit a parse tree produced by CompiladorCParser#decremento.
	visitDecremento(ctx) {
		const id = ctx.ID().getText()
		if (ctx.INCREMENTO()){
		this.addCodeLine(id+'++;')
	}
	else {
		this.addCodeLine(id+'--;')
	}
	  }

	// Visit a parse tree produced by CompiladorCParser#expr.
	visitExpr(ctx) {
		if (ctx.NUMBER()) {
			return ctx.NUMBER().getText()
        } else if (ctx.ID()) {
			return ctx.ID().getText()
		} else if (ctx.RESIDUO()){
			return this.visit(ctx.expr(0)) + ' % ' + this.visit(ctx.expr(1))
		}else if (ctx.ADDIGUAL()){
			return this.visit(ctx.expr(0)) + ' += ' + this.visit(ctx.expr(1))+';'
		}
         else {
			for (let i = 0; i < ctx.expr().length; i++) {
			if (ctx.operation.type==18){
				return this.visit(ctx.expr(0)) + ' * ' + this.visit(ctx.expr(1))
			}
			else if (ctx.operation.type==19){
				return this.visit(ctx.expr(0)) + ' / ' + this.visit(ctx.expr(1))
			}
			else if (ctx.operation.type==20){
				return this.visit(ctx.expr(0)) + ' + ' + this.visit(ctx.expr(1))
			}
			else if (ctx.operation.type==21) {
				return this.visit(ctx.expr(0)) + ' - ' + this.visit(ctx.expr(1))
			}
		}
	}
}

	// Visit a parse tree produced by CompiladorCParser#impression.
	visitImpression(ctx) {
		if (ctx.ORACION()){
		this.addCodeLine('Imp(' + ctx.ORACION().getText() + ');')
		}
		else if (ctx.ID()){
			this.addCodeLine('Imp(' + ctx.ID().getText() + ');')
		}
	}
	
}

