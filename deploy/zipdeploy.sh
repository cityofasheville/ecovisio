echo "Packaging function as zip..."
rm -f layer.zip
rm -f function.zip
rm -rf layer
mkdir layer
mkdir layer/nodejs
cd layer/nodejs
cp ../../../package.json .
cp ../../../package-lock.json .
npm ci
cd ..
zip -rq ../layer.zip .
cd ..
rm -rf layer

cd ..
zip -q ./deploy/function.zip ./*.js package.json
cd deploy
echo "send it"
# terraform apply -auto-approve -var-file=ca.tfvars
terraform apply -var-file=ca.tfvars 