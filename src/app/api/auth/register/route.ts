import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request){
  const {name , email , password} = await req.json();

  if(!name || !email || !password){
  return NextResponse.json({error: "Missing required fields"}, {status: 400});
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  const normalizedEmail = email.toLowerCase().trim();

  const existing = await prisma.user.findUnique({where: {email : normalizedEmail}});

  if(existing){
    return NextResponse.json({error : "An Account with this Email already exists"} , { status : 409});
  }

  const hashed = await bcrypt.hash(password , 10);

  const user = await prisma.user.create({
    data: {name: name.trim() , email: normalizedEmail , password: hashed} , 
    select: {id: true , name : true , email: true}
  });

  return NextResponse.json({user} , {status: 201});
}


