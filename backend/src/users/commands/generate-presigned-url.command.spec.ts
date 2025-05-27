// act

import { Test, TestingModule } from '@nestjs/testing';
import { AwsService, FileKey } from './../../aws/aws.service';
import {
  GeneratePresignedUrlCommand,
  GeneratePresignedUrlHandler,
} from './generate-presigned-url.command';
describe('CreatePresignUrlHandler', () => {
  let handler: GeneratePresignedUrlHandler;
  let awsService: AwsService;

  // Arrange
  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        GeneratePresignedUrlHandler,
        {
          // Mock AWS service
          provide: AwsService,
          useValue: {
            generatePresignedUrl: jest.fn().mockResolvedValue('mocked-url'),
          },
        },
      ],
    }).compile();

    // Get the handler and awsService from the module
    handler = moduleRef.get<GeneratePresignedUrlHandler>(
      GeneratePresignedUrlHandler,
    );
    awsService = moduleRef.get<AwsService>(AwsService);
  });

  it('should generate a presigned url successfully', async () => {
    // Arrange : Prepare the mock data
    const mockRequest = {
      fileName: 'test-file.pdf',
      folderUserId: 'user-id',
      fileKey: FileKey.CV,
    };

    // Mock the AwsService
    awsService.generatePresignedUrl = jest.fn().mockResolvedValue('mocked-url');

    // Act : Execute the command
    const result = await handler.execute(
      new GeneratePresignedUrlCommand(mockRequest),
    );

    // Assert : Check the result
    expect(result).toEqual({ presignedUrl: 'mocked-url' });
    expect(awsService.generatePresignedUrl).toHaveBeenCalledWith(
      mockRequest.fileName,
      mockRequest.folderUserId,
      mockRequest.fileKey,
      'application/octet-stream',
    );
  });
});
