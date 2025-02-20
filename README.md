# NFT website template

This is a simple website template for getting NFT information directly from chain. It uses wallet (like metamask) to assure NFT connection.

## Acquire website files

### Basic

If you have no experience with git and would still like to use our template file to enable your freshly deployed NFT collection, feel free to click the green button "Code" on the upper right corner of this website and then selecting "Download ZIP".
Once downloaded, the zip file includes all files you need to display your NFT collection. Before that happens you need to configure the file, as explained in Configure section.

### Advanced

1. Fork the repo
2. Set up environment variables
3. Make changes to the website (optional)
4. Deploy files to Apillon hosting

## Configure

Before the template can interact with the Smart Contract you have deployed via UI, it needs to be configured using environment variables.

To configure the template, do the following:

1. Set the environment variables in your system or create a .env file in the root of your project.
2. Add the following variables to your .env file:
```
CONTRACT_ADDRESS="your_smart_contract_address"
CHAIN_ID="your_chain_id"
```
Example: 
```
CONTRACT_ADDRESS="0xYourSmartContractAddress"
# Uncomment the chain you are using by deleting the `#`
# CHAIN_ID="0x507" # Moonbase
# CHAIN_ID="0x504" # Moonbeam
# CHAIN_ID="0x250" # Astar
```
3. Save the .env file.
​
## Preview the website on your computer

Before uploading the website to Apillon hosting, feel free to edit the code, add any customization or just review whether everything works as expected.

To preview the website on your computer you need to serve a http server from the root folder of the website. For example, you can run node package http-server from root folder like this:

```sh
npm install
npm run dev
```

## Deploy to Apillon Hosting

To deploy the website on Apillon hosting you need to build project with a command below:

```sh
npm run generate
```

And then deploy folder **dist** according to this documentation: [Wiki](https://wiki.apillon.io/build/2-web3-services.html#web3-hosting)

### Basic

1. If not already, register to [Apillon.io](https://app.apillon.io)
2. Log in to Apillon console and create new Hosting bucket inside your project.
3. Select all files of your website (as configured in the previous step) and use drag&drop action to pull the files into the Hosting bucket
4. Once the files are uploaded, push them to Staging and finally to the Production
5. Add your custom domain (as displayed in the dashboards UI)
6. Review your newly deployed website

### Advanced

To deploy your NFT website to Apillon Hosting you should:

1. Clone this repository and [configure](#configure) it to your needs.
2. If not already, register to [Apillon.io](https://app.apillon.io)
3. Log in to Apillon console and create new Hosting bucket inside your project.
4. In settings, create an API KEY with storage permissions. Write down API key and API secret.
5. In your github repository setup actions secrets (variables)
   - WEBSITE_UUID : copy UUID from hosting bucket on Apillon dashboard
   - APILLON_API_KEY : your previously created API key
   - APILLON_API_SECRET : your previously created API secret

Now everything should be ready. When you will push to master branch, your website should start deploy to Apillon IPFS hosting. Monitor progress on [Apillon.io](https://app.apillon.io) dashboard. After some time you'll be able to get IPNS url and also setup your own domain.

You can change behavior of the automatic deployment by editing [/.github/workflows/deploy.yml](/.github/workflows/deploy.yml).
