"use client";

import Link from "next/link"
import Image from "next/image"
import { ThemeToggler } from "@/components/ThemeToggler"
import { SearchInput } from "@/components/SearchInput"
import AuthButton from "./AuthButton"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

function Header({ genreDropdown }: { genreDropdown: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <header className="fixed w-full z-20 top-0 flex items-center
    justify-between p-5 bg-gradient-to-t from-gray-200/0 via-gray-900/25
    to-gray-900">
        <Link href="/" className="mr-10">
           <Image 
              src="https://links.papareact.com/a943ae" alt="Disney Logo"
              width={120}
              height={100}
              className="cursor-pointer invert-0 dark:invert"
            />  
        </Link>

        <div className="flex space-x-2">
             {genreDropdown}
             <SearchInput />
             {user && (
               <Button asChild variant="outline" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
                 <Link href="/watchlist" className="flex items-center gap-2">
                   <Heart className="w-4 h-4" />
                   Watchlist
                 </Link>
               </Button>
             )}
             <ThemeToggler />
             <AuthButton />
        </div>
    </header>
  )
}

export default Header