import { PostTable, UpdatePost } from '@/db/schemas';
import { BaseService } from '@/lib/core/BaseService';
import { successResponse, TResponse } from '@/lib/utils/response.util';
import { PostRepository } from '@/repository/post.repository';
import { injectable } from 'tsyringe';

@injectable()
export class PostService extends BaseService<typeof PostTable, PostRepository> {
  constructor(repository: PostRepository) {
    super(repository);
  }

  async findAll(options: any): Promise<TResponse<any>> {
    const posts = await this.repository.findAll(options);
    return successResponse(posts, 'Posts fetched successfully');
  }

  async findById(id: string): Promise<TResponse<any>> {
    const post = await this.repository.findById(id);

    if (!post) {
      throw new Error('Post not found');
    }

    return successResponse(post, 'Post fetched successfully');
  }

  async createPost(data: {
    title: string;
    content: string;
    author: string;
  }): Promise<TResponse<any>> {
    const post = await this.repository.create(data);
    return successResponse(post, 'Post created successfully');
  }

  async updatePost(
    id: string,
    {
      userId,
      role,
    }: {
      userId: string;
      role: string;
    },
    data: UpdatePost,
  ): Promise<TResponse<any>> {
    const post = await this.repository.findById(id);

    if (!post) {
      throw new Error('Post not found');
    }

    const isAdmin = role === 'admin' || role === 'super_admin';
    const isAuthor = post.author === userId;

    if (!isAdmin && !isAuthor) {
      throw new Error('Forbidden: You cannot update this post');
    }

    const updatedPost = await this.repository.update(id, data);

    return successResponse(updatedPost, 'Post updated successfully');
  }

  async deletePost(
    id: string,
    {
      userId,
      role,
    }: {
      userId: string;
      role: string;
    },
  ): Promise<TResponse<null>> {
    const post = await this.repository.findById(id);

    if (!post) {
      throw new Error('Post not found');
    }

    const isAdmin = role === 'admin' || role === 'super_admin';
    const isAuthor = post.author === userId;

    if (!isAdmin && !isAuthor) {
      throw new Error('Forbidden: You cannot delete this post');
    }

    await this.repository.delete(id);

    return successResponse(null, 'Post deleted successfully');
  }
}
