import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UseGuards } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { ProtectGuard } from 'src/common/guard/protect.guard';

@Controller('article')
@UseInterceptors(CacheInterceptor)
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}
  
  @Post()
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articleService.create(createArticleDto);
  }

  @Get()
  @CacheTTL(10000)
  //@UseGuards(ProtectGuard)
  findAll(@Query() query) {
    return this.articleService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(+id, updateArticleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articleService.remove(+id);
  }
}
