import { FindOptionsSchema } from '@/lib/core/IBaseRepository';
import { Controller, Delete, Get, Post, Put } from '@/lib/decorator';
import { Public, ValidateUser } from '@/lib/decorator/auth.decorators';
import { AuthRequest } from '@/lib/middleware/auth.middleware';
import { errorResponse } from '@/lib/utils/response.util';
import { PostService } from '@/services/post.service';
import { Request, Response } from 'express';
import { injectable } from 'tsyringe';

@injectable()
@Controller('/api/posts')
@ValidateUser()
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('/')
  @Public()
  async getPosts(req: Request, res: Response) {
    const parsedQuery = FindOptionsSchema.safeParse(req.query);
    if (!parsedQuery.success) {
      console.error(parsedQuery.error);
      return res
        .status(400)
        .json(errorResponse(parsedQuery.error, 'Invalid query'));
    }

    try {
      const posts = await this.postService.findAll(parsedQuery.data);
      return res.status(200).json(posts);
    } catch (err: any) {
      return res.status(400).json(errorResponse(err, err.message));
    }
  }

  @Get('/:id')
  async getPostById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const post = await this.postService.findById(id);
      return res.status(200).json(post);
    } catch (err: any) {
      return res.status(404).json(errorResponse(err, err.message));
    }
  }

  @Post('/')
  async createPost(req: AuthRequest, res: Response) {
    const userId = req?.user?.sub;

    if (!userId) {
      return res.status(401).json(errorResponse(null, 'Unauthorized'));
    }

    const { title, content } = req.body;

    try {
      const post = await this.postService.createPost({
        title,
        content,
        author: userId,
      });

      return res.status(201).json(post);
    } catch (err: any) {
      return res.status(400).json(errorResponse(err, err.message));
    }
  }

  @Put('/:id')
  async updatePost(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const { title, content, status } = req.body;

    const userId = req?.user?.sub;
    const role = req?.user?.role;

    if (!userId || !role) {
      return res.status(401).json(errorResponse(null, 'Unauthorized'));
    }

    try {
      const updatedPost = await this.postService.updatePost(
        id,
        { userId, role },
        { title, content, status },
      );
      return res.status(200).json(updatedPost);
    } catch (err: any) {
      return res.status(400).json(errorResponse(err, err.message));
    }
  }

  @Delete('/:id')
  async deletePost(req: AuthRequest, res: Response) {
    const { id } = req.params;

    const userId = req?.user?.sub;
    const role = req?.user?.role;

    if (!userId || !role) {
      return res.status(401).json(errorResponse(null, 'Unauthorized'));
    }

    try {
      const deletedPost = await this.postService.deletePost(id, {
        userId,
        role,
      });
      return res.status(200).json(deletedPost);
    } catch (err: any) {
      return res.status(400).json(errorResponse(err, err.message));
    }
  }
}
