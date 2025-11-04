import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SwapService } from './swap.service';
import { SwapController } from './swap.controller';

@Module({
  imports: [HttpModule],
  controllers: [SwapController],
  providers: [SwapService],
})
export class SwapModule {}

