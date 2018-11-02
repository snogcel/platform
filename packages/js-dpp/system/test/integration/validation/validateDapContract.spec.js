const validateDapContract = require('../../../lib/validation/validateDapContract');

const getLovelyContract = require('../../../lib/test/fixtures/getLovelyContract');

describe('validateDapContract', () => {
  let dapContract;

  beforeEach(() => {
    dapContract = getLovelyContract();
  });

  it('should return error if $schema is not present', () => {
    delete dapContract.$schema;

    const errors = validateDapContract(dapContract);

    expect(errors).to.be.an('array').and.lengthOf(1);
    expect(errors[0].dataPath).to.be.equal('');
    expect(errors[0].keyword).to.be.equal('required');
    expect(errors[0].params.missingProperty).to.be.equal('$schema');
  });

  it('should return error if $schema is not valid', () => {
    dapContract.$schema = 'wrong';

    const errors = validateDapContract(dapContract);

    expect(errors).to.be.an('array').and.lengthOf(1);
    expect(errors[0].keyword).to.be.equal('const');
    expect(errors[0].dataPath).to.be.equal('.$schema');
  });

  it('should return error if contract name is not present', () => {
    delete dapContract.name;

    const errors = validateDapContract(dapContract);

    expect(errors).to.be.an('array').and.lengthOf(1);
    expect(errors[0].dataPath).to.be.equal('');
    expect(errors[0].keyword).to.be.equal('required');
    expect(errors[0].params.missingProperty).to.be.equal('name');
  });

  it('should return error if contract name is not alphanumeric', () => {
    dapContract.name = '*(*&^';

    const errors = validateDapContract(dapContract);

    expect(errors).to.be.an('array').and.lengthOf(1);
    expect(errors[0].dataPath).to.be.equal('.name');
    expect(errors[0].keyword).to.be.equal('pattern');
  });

  it('should return error if contract version is not present', () => {
    delete dapContract.version;

    const errors = validateDapContract(dapContract);

    expect(errors).to.be.an('array').and.lengthOf(1);
    expect(errors[0].dataPath).to.be.equal('');
    expect(errors[0].keyword).to.be.equal('required');
    expect(errors[0].params.missingProperty).to.be.equal('version');
  });

  it('should return error if contract version is not a number', () => {
    dapContract.version = 'wrong';

    const errors = validateDapContract(dapContract);

    expect(errors).to.be.an('array').and.lengthOf(1);
    expect(errors[0].dataPath).to.be.equal('.version');
    expect(errors[0].keyword).to.be.equal('type');
  });

  it('should return error if contract has no `objectsDefinition` property', () => {
    delete dapContract.objectsDefinition;

    const errors = validateDapContract(dapContract);

    expect(errors).to.be.an('array').and.lengthOf(1);
    expect(errors[0].dataPath).to.be.equal('');
    expect(errors[0].keyword).to.be.equal('required');
    expect(errors[0].params.missingProperty).to.be.equal('objectsDefinition');
  });

  describe('objects', () => {
    it('should return error if object definition missing property `properties`', () => {
      delete dapContract.objectsDefinition.niceObject.properties;

      const errors = validateDapContract(dapContract);

      expect(errors).to.be.an('array').and.lengthOf(1);
      expect(errors[0].dataPath).to.be.equal('.objectsDefinition[\'niceObject\']');
      expect(errors[0].keyword).to.be.equal('required');
      expect(errors[0].params.missingProperty).to.be.equal('properties');
    });

    it('should return error if object definition has no properties defined', () => {
      dapContract.objectsDefinition.niceObject.properties = {};

      const errors = validateDapContract(dapContract);

      expect(errors).to.be.an('array').and.lengthOf(1);
      expect(errors[0].dataPath).to.be.equal('.objectsDefinition[\'niceObject\'].properties');
      expect(errors[0].keyword).to.be.equal('minProperties');
    });

    it('should return error if object definition has a non-alphanumeric name', () => {
      dapContract.objectsDefinition['(*&^'] = dapContract.objectsDefinition.niceObject;

      const errors = validateDapContract(dapContract);

      expect(errors).to.be.an('array').and.lengthOf(1);
      expect(errors[0].dataPath).to.be.equal('.objectsDefinition');
      expect(errors[0].keyword).to.be.equal('additionalProperties');
    });

    it('should return error if object definition has a non-alphanumeric property name', () => {
      dapContract.objectsDefinition.niceObject.properties['(*&^'] = {};

      const errors = validateDapContract(dapContract);

      expect(errors).to.be.an('array').and.lengthOf(2);
      expect(errors[0].dataPath).to.be.equal('.objectsDefinition[\'niceObject\'].properties');
      expect(errors[0].keyword).to.be.equal('pattern');
      expect(errors[1].dataPath).to.be.equal('.objectsDefinition[\'niceObject\'].properties');
      expect(errors[1].keyword).to.be.equal('propertyNames');
    });

    it('should return error if object definition overwrite base object properties');

    it.skip('should return error if object definition has no \'additionalProperties\' property', () => {
      delete dapContract.objectsDefinition.niceObject.additionalProperties;

      const errors = validateDapContract(dapContract);

      expect(errors).to.be.an('array').and.lengthOf(1);
      expect(errors[0].dataPath).to.be.equal('.objectsDefinition[\'niceObject\']');
      expect(errors[0].keyword).to.be.equal('required');
      expect(errors[0].params.missingProperty).to.be.equal('additionalProperties');
    });

    it.skip('should return error if object definition allows to create additional properties', () => {
      dapContract.objectsDefinition.niceObject.additionalProperties = true;

      const errors = validateDapContract(dapContract);

      expect(errors).to.be.an('array').and.lengthOf(1);
      expect(errors[0].dataPath).to.be.equal('.objectsDefinition[\'niceObject\'].additionalProperties');
      expect(errors[0].keyword).to.be.equal('const');
    });

    it('should return error if object allOf directive is missing', () => {
      delete dapContract.objectsDefinition.niceObject.allOf;

      const errors = validateDapContract(dapContract);

      expect(errors).to.be.an('array').and.lengthOf(1);
      expect(errors[0].dataPath).to.be.equal('.objectsDefinition[\'niceObject\']');
      expect(errors[0].keyword).to.be.equal('required');
      expect(errors[0].params.missingProperty).to.be.equal('allOf');
    });

    it('should return error if object ref to base object is missing', () => {
      dapContract.objectsDefinition.niceObject.allOf = [];

      const errors = validateDapContract(dapContract);

      expect(errors).to.be.an('array').and.lengthOf(1);
      expect(errors[0].dataPath).to.be.equal('.objectsDefinition[\'niceObject\'].allOf');
      expect(errors[0].keyword).to.be.equal('minItems');
    });

    it('should pass if object inherits base object and something else', () => {
      dapContract.objectsDefinition.niceObject.allOf.push({
        $ref: 'something else',
      });

      const errors = validateDapContract(dapContract);

      expect(errors).to.be.null();
    });
  });

  it('should return null if contract is valid', () => {
    const errors = validateDapContract(dapContract);

    expect(errors).to.be.null();
  });
});