import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AllExceptionsFilter } from './all-exceptions.filter';

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;
  let mockResponse: any;
  let mockRequest: any;
  let mockHost: ArgumentsHost;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AllExceptionsFilter],
    }).compile();

    filter = module.get<AllExceptionsFilter>(AllExceptionsFilter);

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockRequest = {
      url: '/test-url',
      body: { key: 'value' },
    };

    mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    } as unknown as ArgumentsHost;
  });

  it('should handle HttpException and return the correct response', () => {
    const httpException = new HttpException('Not Found', HttpStatus.NOT_FOUND);

    filter.catch(httpException, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.NOT_FOUND,
      url: '/test-url',
      message: 'Not Found',
      stack: expect.any(String),
      payload: { key: 'value' },
    });
  });

  it('should handle generic Error and return INTERNAL_SERVER_ERROR', () => {
    const error = new Error('Some unexpected error');

    filter.catch(error, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      url: '/test-url',
      message: 'Some unexpected error',
      stack: expect.any(String),
      payload: { key: 'value' },
    });
  });

  it('should handle an unknown type of exception', () => {
    const unknownException = { some: 'unknown exception' };

    filter.catch(unknownException, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      url: '/test-url',
      message: 'An unexpected error occurred',
      stack: null,
      payload: { key: 'value' },
    });
  });
});
