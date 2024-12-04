import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import aiService from '../services/aiService.js';
import aiModels from '../models/aiModels.js';

chai.use(chaiAsPromised);
const { expect } = chai;

describe('aiService', () => {
    let mock;

    beforeEach(() => {
        mock = sinon.mock(aiModels);
    });

    afterEach(() => {
        mock.restore();
    });

    describe('checkSymptoms', () => {
        it('should return conditions when symptoms are valid', async () => {
            const mockConditions = [{ condition: 'Flu' }];
            mock.expects('checkSymptoms').resolves(mockConditions);

            const symptoms = ['cough', 'fever'];
            const result = await aiService.checkSymptoms(symptoms);

            expect(result).to.deep.equal(mockConditions);
            mock.verify();
        });

        it('should throw an error when conditions structure is invalid', async () => {
            mock.expects('checkSymptoms').resolves(null);

            await expect(aiService.checkSymptoms(['cough', 'fever']))
                .to.eventually.be.rejectedWith('Failed to analyze symptoms.');
            mock.verify();
        });
    });

    describe('determineTriage', () => {
        it('should return triage when symptomData is valid', async () => {
            const mockTriage = { level: 'urgent' };
            mock.expects('triage').resolves(mockTriage);

            const symptomData = { symptoms: ['cough', 'fever'] };
            const result = await aiService.determineTriage(symptomData);

            expect(result).to.deep.equal(mockTriage);
            mock.verify();
        });

        it('should throw an error when triage structure is invalid', async () => {
            mock.expects('triage').resolves(null);

            await expect(aiService.determineTriage({ symptoms: ['cough', 'fever'] }))
                .to.eventually.be.rejectedWith('Failed to determine triage level.');
            mock.verify();
        });
    });

    describe('parseSymptoms', () => {
        it('should return symptoms when text is valid', async () => {
            const mockSymptoms = ['cough', 'fever'];
            mock.expects('parseSymptoms').resolves(mockSymptoms);

            const text = 'I have a cough and fever';
            const result = await aiService.parseSymptoms(text);

            expect(result).to.deep.equal(mockSymptoms);
            mock.verify();
        });

        it('should throw an error when symptoms structure is invalid', async () => {
            mock.expects('parseSymptoms').resolves(null);

            await expect(aiService.parseSymptoms('I have a cough and fever'))
                .to.eventually.be.rejectedWith('Failed to parse symptoms.');
            mock.verify();
        });
    });

    describe('predictDiseaseTrends', () => {
        it('should return predictions when historicalData is valid', async () => {
            const mockPredictions = { trend: 'increasing' };
            mock.expects('analyzeTrends').resolves(mockPredictions);

            const historicalData = { data: [/* some data */] };
            const result = await aiService.predictDiseaseTrends(historicalData);

            expect(result).to.deep.equal(mockPredictions);
            mock.verify();
        });

        it('should throw an error when predictions structure is invalid', async () => {
            mock.expects('analyzeTrends').resolves(null);

            await expect(aiService.predictDiseaseTrends({ data: [/* some data */] }))
                .to.eventually.be.rejectedWith('Failed to predict disease trends.');
            mock.verify();
        });
    });
});
