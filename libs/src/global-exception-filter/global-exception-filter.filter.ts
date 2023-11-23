import type { ArgumentsHost } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import type { Response } from 'express';
import { ZodValidationException } from 'nestjs-zod';
import { ZodError } from 'zod';

@Catch()
export class GlobalExceptionFilterFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2002': {
          response.status(HttpStatus.CONFLICT).json({
            message:
              'Account already exists. Please log in or reset your password to continue.',
          });
          break;
        }
        case 'P2022': {
          response
            .status(HttpStatus.UNPROCESSABLE_ENTITY)
            .json({ message: 'Sorry!. Wrong input arguments' });
          break;
        }
        case 'P2025': {
          response
            .status(HttpStatus.UNPROCESSABLE_ENTITY)
            .json({ message: 'Sorry!. Wrong input arguments' });
          break;
        }

        default:
          response.sendStatus(HttpStatus.BAD_REQUEST);
          break;
      }

      return;
    }

    if (exception instanceof PrismaClientValidationError) {
      response.status(HttpStatus.BAD_REQUEST).json({
        message:
          "Sorry!. There could be typos, or extra characters in the field. It's important refresh and try again.",
      });
      return;
    }

    if (exception instanceof ZodValidationException) {
      response.status(exception.getStatus()).json({
        message: exception.message,
        data: exception.getZodError().errors.map(({ path, message }) => {
          return { path, message };
        }),
      });
      return;
    }

    if (exception instanceof ZodError) {
      response.status(HttpStatus.BAD_REQUEST).json({
        message: 'Sorry!. Invalid Schema',
        data: exception.errors.map(({ path, message }) => {
          return { path, message };
        }),
      });
      return;
    }

    super.catch(exception, host);
  }
}
