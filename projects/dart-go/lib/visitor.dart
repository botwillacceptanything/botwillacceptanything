library dart_go.visitor;

import "package:analyzer/analyzer.dart";
import "package:analyzer/src/generated/ast.dart";

class GoVisitor extends GeneralizingAstVisitor {
  StringBuffer buff = new StringBuffer();

  @override
  visitFunctionDeclaration(FunctionDeclaration node) {
    buff.write("func ${node.name.toSource()}() {");
    visitNode(node.functionExpression);
    buff.write("}");
  }

  @override
  visitFunctionDeclarationStatement(FunctionDeclarationStatement statement) {
    statement.functionDeclaration.accept(this);
  }

  @override
  visitBlock(Block node) {
    buff.write("\n  ");
    var i = 0;
    for (var b in node.statements) {
      b.accept(this);
      buff.write("\n");
    }
  }

  @override
  visitCompilationUnit(CompilationUnit unit) {
    if (unit.directives.any((it) => it is LibraryDirective)) {
      var name = (unit.directives.where((it) => it is LibraryDirective).first as LibraryDirective).name.toSource();
      buff.writeln('package "${name}"');
    } else {
      buff.writeln('package "main"');
    }
    unit.directives.accept(this);
    unit.declarations.where((it) => it is! SimpleIdentifier).map((it) {
      return it;
    }).toList().forEach((AstNode node) => node.accept(this));
  }

  @override
  visitMethodInvocation(MethodInvocation node) {
    node.realTarget.accept(this);
    buff.write(".${node.methodName.toSource()}");
    buff.write("(");
    var i = 0;
    var a = node.argumentList.arguments;
    while (true) {
      if (i == a.length) {
        break;
      }

      var c = a[i];
      c.accept(this);

      if (i != a.length - 1) {
        buff.write(",");
      }

      i++;
    }
    buff.write(")");
  }

  @override
  visitSimpleIdentifier(SimpleIdentifier id) {
    buff.write(id.toSource());
  }

  @override
  visitStringLiteral(StringLiteral node) {
    buff.write('"');
    buff.write(stringLiteralToString(node));
    buff.write('"');
  }

  @override
  visitExpressionStatement(ExpressionStatement node) {
    node.expression.accept(this);
  }

  @override
  visitFunctionExpression(FunctionExpression node) {
    visitNode(node.body);
  }

  @override
  visitImportDirective(ImportDirective directive) {
    buff.write('import ${directive.uri.toSource()}\n');
  }

  @override
  visitPropertyAccess(PropertyAccess access) {
    visitNode(access.target);
    buff.write(".");
    buff.write("${access.propertyName.toSource()}");
  }
}
