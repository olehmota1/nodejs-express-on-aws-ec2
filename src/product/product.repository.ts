import { EntityRepository } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';
import { Product } from './product.entity';

@EntityRepository(Product)
export class ProductRepository extends BaseRepository<Product> {}
