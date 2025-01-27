const Drive = require('@dashevo/rs-drive');
const fs = require('fs');

const LastSyncedSmlHeightRepository = require('../../../../lib/identity/masternode/LastSyncedCoreHeightRepository');
const StorageResult = require('../../../../lib/storage/StorageResult');
const GroveDBStore = require('../../../../lib/storage/GroveDBStore');
const logger = require('../../../../lib/util/noopLogger');

describe('LastSyncedSmlHeightRepository', () => {
  let repository;
  let store;
  let rsDrive;

  beforeEach(async () => {
    rsDrive = new Drive('./db/grovedb_test');
    store = new GroveDBStore(rsDrive, logger);

    repository = new LastSyncedSmlHeightRepository(store);

    // Create misc tree
    await store.createTree(
      [],
      Buffer.from([5]),
      { useTransaction: true },
    );
  });

  afterEach(async () => {
    await rsDrive.close();
    fs.rmSync('./db/grovedb_test', { recursive: true });
  });

  describe('#store', () => {
    it('should store last synced height', async () => {
      const result = await repository.store(1, {
        useTransaction: true,
      });

      expect(result).to.be.instanceOf(StorageResult);
      expect(result.getOperations().length).to.be.greaterThan(0);

      const placeholderResult = await store.get(
        LastSyncedSmlHeightRepository.TREE_PATH,
        LastSyncedSmlHeightRepository.KEY,
      );

      const encodedValue = placeholderResult.getValue();

      expect(encodedValue.readUInt32BE()).to.deep.equal(1);
    });
  });

  describe('#fetch', () => {
    it('should return null if last synced height is not present', async () => {
      const result = await repository.fetch();

      expect(result).to.be.instanceOf(StorageResult);
      expect(result.getOperations().length).to.be.greaterThan(0);

      expect(result.getValue()).to.be.null();
    });

    it('should return last synced height', async () => {
      const encodedValue = Buffer.alloc(4);

      encodedValue.writeUInt32BE(1);

      await store.put(
        LastSyncedSmlHeightRepository.TREE_PATH,
        LastSyncedSmlHeightRepository.KEY,
        encodedValue,
      );

      const result = await repository.fetch();

      expect(result).to.be.instanceOf(StorageResult);
      expect(result.getOperations().length).to.be.greaterThan(0);

      expect(result.getValue()).to.be.deep.equal(1);
    });
  });
});
