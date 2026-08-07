import { Buyer, IBuyer } from '../../models/Buyer';
import { Supplier, ISupplier } from '../../models/Supplier';
import { PasswordService } from './PasswordService';
import { TokenService } from './TokenService';
import { ConflictError, UnauthorizedError, NotFoundError } from '../../errors/CustomErrors';

export class AuthService {
  // Buyer Auth
  async registerBuyer(data: any): Promise<{ user: IBuyer; accessToken: string; refreshToken: string }> {
    const exists = await Buyer.findOne({ email: data.email }).exec();
    if (exists) throw new ConflictError('Email already in use');

    const hashedPassword = await PasswordService.hashPassword(data.password);
    const buyer = new Buyer({ ...data, password: hashedPassword, role: 'Buyer' });
    
    const refreshToken = TokenService.generateRefreshToken();
    buyer.refreshToken = refreshToken;
    await buyer.save();

    const accessToken = TokenService.generateAccessToken({ id: buyer.id, role: buyer.role });

    // Exclude password before returning
    const buyerObj = buyer.toObject();
    delete buyerObj.password;

    return { user: buyerObj as IBuyer, accessToken, refreshToken };
  }

  async loginBuyer(email: string, password: string): Promise<{ user: IBuyer; accessToken: string; refreshToken: string }> {
    const buyer = await Buyer.findOne({ email }).select('+password').exec();
    if (!buyer) throw new UnauthorizedError('Invalid credentials');
    if (buyer.accountStatus === 'suspended') throw new UnauthorizedError('Account is suspended');

    const isValid = await PasswordService.comparePassword(password, buyer.password!);
    if (!isValid) {
      buyer.failedLoginAttempts += 1;
      await buyer.save();
      throw new UnauthorizedError('Invalid credentials');
    }

    const refreshToken = TokenService.generateRefreshToken();
    buyer.refreshToken = refreshToken;
    buyer.failedLoginAttempts = 0;
    buyer.lastLogin = new Date();
    await buyer.save();

    const accessToken = TokenService.generateAccessToken({ id: buyer.id, role: buyer.role });

    const buyerObj = buyer.toObject();
    delete buyerObj.password;

    return { user: buyerObj as IBuyer, accessToken, refreshToken };
  }

  // Supplier Auth
  async registerSupplier(data: any): Promise<{ user: ISupplier; accessToken: string; refreshToken: string }> {
    const exists = await Supplier.findOne({ email: data.email }).exec();
    if (exists) throw new ConflictError('Email already in use');

    const hashedPassword = await PasswordService.hashPassword(data.password);
    const supplier = new Supplier({ ...data, password: hashedPassword, role: 'Supplier' });
    
    const refreshToken = TokenService.generateRefreshToken();
    supplier.refreshToken = refreshToken;
    await supplier.save();

    // Use _id.toString() — works for both ObjectId and string _id types
    const accessToken = TokenService.generateAccessToken({ id: supplier._id.toString(), role: supplier.role });

    const supplierObj = supplier.toObject();
    delete supplierObj.password;

    return { user: supplierObj as ISupplier, accessToken, refreshToken };
  }

  async loginSupplier(email: string, password: string): Promise<{ user: ISupplier; accessToken: string; refreshToken: string }> {
    const supplier = await Supplier.findOne({ email }).select('+password +refreshToken').exec();
    if (!supplier) throw new UnauthorizedError('Invalid credentials');
    if (supplier.accountStatus === 'suspended') throw new UnauthorizedError('Account is suspended');

    const isValid = await PasswordService.comparePassword(password, supplier.password!);
    if (!isValid) {
      supplier.failedLoginAttempts += 1;
      await supplier.save();
      throw new UnauthorizedError('Invalid credentials');
    }

    const refreshToken = TokenService.generateRefreshToken();
    supplier.refreshToken = refreshToken;
    supplier.failedLoginAttempts = 0;
    supplier.lastLogin = new Date();
    await supplier.save();

    // Use _id.toString() — works for both ObjectId and string _id types
    const accessToken = TokenService.generateAccessToken({ id: supplier._id.toString(), role: supplier.role });

    const supplierObj = supplier.toObject();
    delete supplierObj.password;

    return { user: supplierObj as ISupplier, accessToken, refreshToken };
  }

  // Shared
  async refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    // Search both collections for the token (simplified logic for sprint)
    let user: any = await Buyer.findOne({ refreshToken }).exec();
    if (!user) {
      user = await Supplier.findOne({ refreshToken }).exec();
    }
    
    if (!user) throw new UnauthorizedError('Invalid refresh token');

    const newRefreshToken = TokenService.generateRefreshToken();
    user.refreshToken = newRefreshToken;
    await user.save();

    const accessToken = TokenService.generateAccessToken({ id: user.id, role: user.role });

    return { accessToken, refreshToken: newRefreshToken };
  }

  async logout(userId: string, role: string): Promise<void> {
    if (role === 'Buyer') {
      await Buyer.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } }).exec();
    } else {
      await Supplier.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } }).exec();
    }
  }
}
