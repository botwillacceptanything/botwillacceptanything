import "dart:io";
import "package:dart_go/compile.dart";

void main() {
  print(compile(new File("example/hello.dart")));
}
