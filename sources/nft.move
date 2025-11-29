module sui_nft_studio::nft {
    use std::string::{Self as string, String};
    use sui::event;
    use sui::object::{Self as object, ID, UID};
    use sui::tx_context::{Self as tx_context, TxContext};
    use sui::transfer;

    const E_NOT_AUTHORIZED: u64 = 0;

    /// Primary on-chain NFT representation with rich metadata.
    public struct SuiNFT has key, store {
        id: UID,
        name: String,
        description: String,
        image_url: String,
        creator: address,
    }

    /// Capability that authorizes controlled minting.
    public struct MintCap has key {
        id: UID,
        authority: address,
    }

    public struct MintEvent has copy, drop {
        creator: address,
        recipient: address,
        name: String,
        object_id: ID,
    }

    public struct TransferEvent has copy, drop {
        sender: address,
        recipient: address,
        object_id: ID,
    }

    public struct BurnEvent has copy, drop {
        owner: address,
        object_id: ID,
    }

    /// Called automatically when the package is published. The deployer receives the mint cap.
    fun init(ctx: &mut TxContext) {
        let deployer = tx_context::sender(ctx);
        let cap = MintCap {
            id: object::new(ctx),
            authority: deployer,
        };
        transfer::transfer(cap, deployer);
    }

    /// Mint a new NFT and send it to `recipient`. Requires the mint authority.
    public entry fun mint(
        cap: &MintCap,
        name: String,
        description: String,
        image_url: String,
        recipient: address,
        ctx: &mut TxContext,
    ) {
        assert!(tx_context::sender(ctx) == cap.authority, E_NOT_AUTHORIZED);

        let uid = object::new(ctx);
        let object_id = object::uid_to_id(&uid);
        let nft = SuiNFT {
            id: uid,
            name,
            description,
            image_url,
            creator: cap.authority,
        };

        let minted_name = string::clone(&nft.name);

        event::emit(MintEvent {
            creator: cap.authority,
            recipient,
            name: minted_name,
            object_id,
        });

        transfer::transfer(nft, recipient);
    }

    /// Transfer helper that lets end users move their NFT to a new address.
    public entry fun transfer_nft(nft: SuiNFT, recipient: address, ctx: &mut TxContext) {
        event::emit(TransferEvent {
            sender: tx_context::sender(ctx),
            recipient,
            object_id: object::uid_to_id(&nft.id),
        });
        transfer::transfer(nft, recipient);
    }

    /// Permanently destroy an NFT you control.
    public entry fun burn(nft: SuiNFT, ctx: &mut TxContext) {
        let object_id = object::uid_to_id(&nft.id);
        event::emit(BurnEvent {
            owner: tx_context::sender(ctx),
            object_id,
        });
        object::delete(nft);
    }
}

