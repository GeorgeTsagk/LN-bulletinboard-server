web:
	protoc -I=. --js_out=import_style=commonjs:. --grpc-web_out=import_style=commonjs,mode=grpcwebtext:. rpc.proto
	protoc -I=. --js_out=import_style=commonjs:.  validator.proto

node:
	protoc -I=. --js_out=import_style=commonjs:.  rpc.proto
	protoc -I=. --js_out=import_style=commonjs:.  validator.proto
