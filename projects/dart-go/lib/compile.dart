library dart_go.compiler;

import "dart:io";

import "package:analyzer/analyzer.dart";

import "visitor.dart";

String compile(File file) {
  var content = file.readAsStringSync();
  var cu = parseCompilationUnit(content);

  var visitor = new GoVisitor();
  cu.accept(visitor);

  return visitor.buff.toString();
}
