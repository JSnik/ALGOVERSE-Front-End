import { Component, Input, OnInit } from '@angular/core';
import { WalletsConnectService } from 'src/app/services/wallets-connect.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { getAlgodClient, isOptinAsset } from 'src/app/services/utils.algod';
import { getApplicationAddress } from 'algosdk';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create-trade',
  templateUrl: './create-trade.component.html',
  styleUrls: ['./create-trade.component.scss']
})
export class CreateTradeComponent implements OnInit {

  private selectedAssetID = 0;
  private assets: any[] = [];
  public assetIDs: string[] = [];
  public maxSupply = 1;
  public selectedAssetDescription = "";
  public metaDataProperties: any = {};

  public royalty: string = "0";
  public amount: string = "0";
  public price: string = "0";

  constructor(
    private _walletsConnectService: WalletsConnectService,
    private _userService: UserService,
    private router: Router
  ) {
  }

  async ngOnInit(): Promise<void> {
    if (!Array.isArray(this._walletsConnectService.myAlgoAddress) || this._walletsConnectService.myAlgoAddress.length == 0) {
      this.router.navigate(['/', 'home']);
      return;
    }

    this.assets = await this._walletsConnectService.getOwnAssets();
    const asset_ids = [];
    for (let asset of this.assets) {
      asset_ids.push(asset.index);
    }
    this.assetIDs = asset_ids;

    const algod = getAlgodClient();
    const accountInfo = await algod.accountInformation('5V3RXJ76GKVG7F55LZIVN6DXOQLNRLAMMNQMFLJ57LP2PP5B7Q64A7IX7A').do();
    console.log('accountInfo 0 0 0 ', accountInfo);

    if (this.assets.length > 0) {
      const firstAsset = this.assets[0];
      this.selectedAssetID = firstAsset.index;
      this.selectedAssetDescription = `Name: ${firstAsset.params.name} \nUnitName: ${firstAsset.params['unit-name']}`;

      if (firstAsset.params.url) {
        this._userService.loadMetaData(firstAsset.params.url).subscribe(
          (result) => {
            console.log(result);
            let properties: any = {};
            for (const [key, value] of Object.entries(result)) {
              properties[key] = JSON.stringify(value);
            }
            this.metaDataProperties = properties;
          },
          (error) => console.log('error', error)
        )
      }

    }
  }

  selectedAsset(assetID: string) {
    this.selectedAssetID = +assetID;

    const asset = this.getAsset(assetID);
    console.log(asset);
    this.selectedAssetDescription = `Name: ${asset.params.name} \nUnitName: ${asset.params['unit-name']}`;
    this.maxSupply = asset.params.total;

    if (asset.params.url) {
      this._userService.loadMetaData(asset.params.url).subscribe(
        (result) => {
          console.log('result', result);
          let properties: any = {};
            for (const [key, value] of Object.entries(result)) {
              properties[key] = JSON.stringify(value);
            }
            this.metaDataProperties = properties;
        },
        (error) => console.log('error', error)
      )
    }
  }

  getAsset(assetID: string) {
    var result = this.assets.find(asset => {
      return asset.index == assetID
    });
    return result;
  }

  blurRoyaltyEvent(event: any){
    this.royalty = event.target.value;
    console.log(this.royalty);
  }

  blurAmountEvent(event: any){
    this.amount = event.target.value;
    console.log(this.amount);
  }

  blurPriceEvent(event: any){
    this.price = event.target.value;
    console.log(this.price);
  }

  async createTrade() {
    // let result = await this._walletsConnectService.payToSetUpIndex('4TT75274EBUAF46CITUL6HQQ4C4D3GO7GEOVRZSQZ35VXSGRVHJ376GD64', 1);
    // console.log(result);

    console.log('trade start');
    this._userService.getTradeIndex(this._walletsConnectService.myAlgoAddress[0], this.selectedAssetID).subscribe(
      async (res) => {
        console.log('tradeIndex', res);

        const indexAddress = res.indexAddress;
        if (res.optinPrice > 0) {
          let result = await this._walletsConnectService.payToSetUpIndex(indexAddress, res.optinPrice);
          console.log('paid index address result', result)
          if (result) {
            this._userService.setupTrade(indexAddress, this.selectedAssetID).subscribe(
              (res) => {
                console.log('setup trade response: ', res);
                this.sendCreateTradeRequest(indexAddress);
              },
              (err) => {
                console.log('setup trade error: ', err);
              }
            );
          }
        } else {
          console.log('trade app address', getApplicationAddress(environment.TRADE_APP_ID));
          if (await isOptinAsset(this.selectedAssetID, getApplicationAddress(environment.TRADE_APP_ID))) {
            console.log('direct create trade', res);
            this.sendCreateTradeRequest(indexAddress);
          } else {
            this._userService.setupTrade(indexAddress, this.selectedAssetID).subscribe(
              (res) => {
                console.log('setup trade response: ', res);
                this.sendCreateTradeRequest(indexAddress);
              },
              (err) => {
                console.log('setup trade error: ', err);
              }
            );
          }
        }
      },
      (error) => console.log('error', error)
    );
  }

  async sendCreateTradeRequest(indexAddress: string) {
    const params1 = {
      assetID: this.selectedAssetID,
      amount: this.amount,
      price: this.price,
      tradeIndex: indexAddress
    }
    const txID = await this._walletsConnectService.createTrade(params1);

    if (txID) {
      const asset = this.getAsset('' + this.selectedAssetID);
      if (!asset) {
        console.log('exception occurred')
        return;
      }

      const params2 = {
        tradeId: txID,
        assetId: this.selectedAssetID,
        asset: {
          assetId: this.selectedAssetID,
          name: asset.name,
          unitName: asset['unit-name'],
          supply: asset.total,
          assetURL: "string",
          creatorWallet: asset.creator,
          freezeAddress: asset.freeze?asset.freeze:'',
          managerAddress: asset.manager?asset.manager:'',
          clawbackAddress: asset.clawback?asset.clawback:'',
          reserveAddress: asset.reserve?asset.reserve:'',
          metadata: asset['metadata-hash']?asset['metadata-hash']:'',
          externalLink: asset.url?asset.url:'',
          description: asset.description?asset.description:'',
          assetCollectionID: "1",
          assetCollection: {
            assetCollectionID: "1",
            name: "string1",
            icon: "string",
            banner: "string",
            featuredImage: "string",
            description: "string",
            royalties: 0,
            customURL: "string",
            category: "string",
            website: "string",
            creatorWallet: "string"
          },
          properties: Object.entries(this.metaDataProperties),
          file: "string",
          cover: "string",
          royalties: 0,
          category: "string"
        },
        indexAddress,
        price: this.price,
        creatorWallet: this._walletsConnectService.myAlgoAddress[0],
        amount: this.amount
      }
      console.log(params2)
      this._userService.createTrade(params2).subscribe(
        res => {
          console.log("Created trade successfully");
          console.log(res)
        },
        error => console.log(error)
      );
    }
  }

}
